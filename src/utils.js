export const calculateTotal = (bills) => {
    return bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
};

export const calculatePending = (total, paid) => {
    return Math.max(0, total - paid);
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

export const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
};

export const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const now = new Date();
    const then = new Date(dateString);
    if (isNaN(then.getTime())) return 'Invalid Date';

    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return then.toLocaleDateString();
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'draft': return '#9ca3af'; // Gray
        case 'submitted': return '#3b82f6'; // Blue
        case 'approved': return '#10b981'; // Green
        case 'rejected': return '#ef4444'; // Red
        case 'partiallySettled': return '#8b5cf6'; // Purple
        case 'settled': return '#059669'; // Dark Green
        default: return '#000000';
    }
};
