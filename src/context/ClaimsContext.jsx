import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const ClaimsContext = createContext();

export const useClaims = () => useContext(ClaimsContext);

export const ClaimsProvider = ({ children }) => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClaims = async () => {
        try {
            const { data, error } = await supabase
                .from('claims')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;

            // Map DB snake_case to app camelCase
            const mappedClaims = (data || []).map(row => ({
                id: row.id,
                patient: row.patient,
                serviceDate: row.service_date,
                status: row.status,
                bills: row.bills || [],
                advances: row.advances || [],
                paidAmount: row.paid_amount,
                updatedAt: row.updated_at,
                createdAt: row.created_at
            }));

            setClaims(mappedClaims);
        } catch (err) {
            console.error("Error fetching claims:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();

        // Realtime subscription
        const channel = supabase
            .channel('public:claims')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, (payload) => {
                fetchClaims();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addClaim = async (claimData) => {
        const now = new Date().toISOString();
        const { dateOfService, ...patientInfo } = claimData;

        const newClaim = {
            patient: patientInfo,
            service_date: dateOfService,
            status: 'draft',
            bills: [],
            advances: [],
            paid_amount: 0.0,
            updated_at: now,
            created_at: now,
        };

        const { data, error } = await supabase
            .from('claims')
            .insert([newClaim])
            .select();

        if (error) {
            console.error("Error creating claim:", error);
            throw error;
        }
        return data[0].id;
    };

    const updateClaimStatus = async (id, status) => {
        const { error } = await supabase
            .from('claims')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) console.error("Error updating status:", error);
    };

    const addBill = async (claimId, bill) => {
        const claim = claims.find(c => c.id === claimId);
        if (!claim) return;

        const now = new Date().toISOString();
        const newBill = { ...bill, id: uuidv4(), date: now };
        const updatedBills = [...(claim.bills || []), newBill];

        const { error } = await supabase
            .from('claims')
            .update({ bills: updatedBills, updated_at: now })
            .eq('id', claimId);

        if (error) console.error("Error adding bill:", error);
    };

    const addAdvance = async (claimId, advance) => {
        const claim = claims.find(c => c.id === claimId);
        if (!claim) return;

        const now = new Date().toISOString();
        const newAdvance = { ...advance, id: uuidv4(), date: now };
        const updatedAdvances = [...(claim.advances || []), newAdvance];

        const { error } = await supabase
            .from('claims')
            .update({ advances: updatedAdvances, updated_at: now })
            .eq('id', claimId);

        if (error) console.error("Error adding advance:", error);
    };

    const updateSettlement = async (claimId, amount) => {
        const claim = claims.find(c => c.id === claimId);
        if (!claim) return;

        const now = new Date().toISOString();
        const newPaid = (claim.paidAmount || 0) + amount;

        const totalBills = (claim.bills || []).reduce((sum, b) => sum + b.amount, 0);
        const totalAdvances = (claim.advances || []).reduce((sum, a) => sum + a.amount, 0);
        const totalTarget = totalBills - totalAdvances;

        let newStatus = claim.status;
        if (newPaid >= totalTarget) newStatus = 'settled';
        else if (newPaid > 0) newStatus = 'partiallySettled';

        const { error } = await supabase
            .from('claims')
            .update({
                paid_amount: newPaid,
                status: newStatus,
                updated_at: now
            })
            .eq('id', claimId);

        if (error) console.error("Error updating settlement:", error);
    };

    return (
        <ClaimsContext.Provider value={{ claims, loading, addClaim, updateClaimStatus, addBill, addAdvance, updateSettlement }}>
            {children}
        </ClaimsContext.Provider>
    );
};
