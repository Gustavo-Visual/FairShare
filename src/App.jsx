import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, DollarSign, Users, Receipt, PiggyBank, RotateCcw, X, Settings, Moon, Sun, Share2, Calendar, Download } from 'lucide-react';

const CURRENCIES = {
    EUR: { symbol: '€', name: 'Euro' },
    USD: { symbol: '$', name: 'US Dollar' },
    GBP: { symbol: '£', name: 'British Pound' },
    BRL: { symbol: 'R$', name: 'Brazilian Real' },
};

const Card = ({ children, className = "", darkMode }) => (
    <div className={`rounded-xl shadow-lg border ${darkMode
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-slate-100'
        } ${className}`}>
        {children}
    </div>
);

const Button = ({ onClick, children, variant = "primary", className = "", disabled = false, type = "button", darkMode = false }) => {
    const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        primary: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
        secondary: darkMode
            ? "bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500"
            : "bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-400",
        danger: darkMode
            ? "bg-red-900/30 hover:bg-red-900/50 text-red-400 focus:ring-red-500"
            : "bg-red-50 hover:bg-red-100 text-red-600 focus:ring-red-400",
        ghost: darkMode
            ? "bg-transparent hover:bg-slate-700 text-slate-400"
            : "bg-transparent hover:bg-slate-50 text-slate-500",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

const STORAGE_KEY = 'fairshare-data';

// Format date for display
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// Format date for input
const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

export default function App() {
    const [activeTab, setActiveTab] = useState('input');
    const [participants, setParticipants] = useState([]);
    const [newName, setNewName] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [currency, setCurrency] = useState('EUR');
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [typedText, setTypedText] = useState('');
    const fullGreeting = "Hello Dr. Gustavo Carita. Let's split those group expenses.";

    // Expense Form State
    const [payer, setPayer] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [expenseDate, setExpenseDate] = useState(getTodayDate());

    const currencySymbol = CURRENCIES[currency].symbol;

    // Load data from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const { participants: savedParticipants, expenses: savedExpenses, currency: savedCurrency, darkMode: savedDarkMode } = JSON.parse(saved);
                if (Array.isArray(savedParticipants)) setParticipants(savedParticipants);
                if (Array.isArray(savedExpenses)) setExpenses(savedExpenses);
                if (savedCurrency && CURRENCIES[savedCurrency]) setCurrency(savedCurrency);
                if (typeof savedDarkMode === 'boolean') setDarkMode(savedDarkMode);
            }
        } catch (e) {
            console.error('Failed to load saved data:', e);
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ participants, expenses, currency, darkMode }));
        } catch (e) {
            console.error('Failed to save data:', e);
        }
    }, [participants, expenses, currency, darkMode]);

    // Typewriter animation effect
    useEffect(() => {
        if (typedText.length < fullGreeting.length) {
            const timeout = setTimeout(() => {
                setTypedText(fullGreeting.slice(0, typedText.length + 1));
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [typedText, fullGreeting]);

    // Add a new person
    const addParticipant = (e) => {
        e.preventDefault();
        const trimmedName = newName.trim();
        if (!trimmedName) return;
        if (participants.some(p => p.toLowerCase() === trimmedName.toLowerCase())) return;

        setParticipants([...participants, trimmedName]);
        setNewName('');
        if (participants.length === 0) setPayer(trimmedName);
    };

    const removeParticipant = (nameToRemove) => {
        setParticipants(participants.filter(p => p !== nameToRemove));
        setExpenses(expenses.filter(e => e.payer !== nameToRemove));
        if (payer === nameToRemove) setPayer('');
    };

    // Add a new expense with validation
    const addExpense = (e) => {
        e.preventDefault();
        if (!payer || !amount || !description.trim()) return;

        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Please enter a valid positive amount.');
            return;
        }

        const newExpense = {
            id: Date.now(),
            payer,
            description: description.trim(),
            amount: parsedAmount,
            date: expenseDate || getTodayDate()
        };

        setExpenses([newExpense, ...expenses]);
        setDescription('');
        setAmount('');
        setExpenseDate(getTodayDate());
    };

    const removeExpense = (id) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    const clearAllData = () => {
        if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            setParticipants([]);
            setExpenses([]);
            setPayer('');
            setDescription('');
            setAmount('');
            setNewName('');
        }
    };

    // Generate shareable text summary
    const generateShareText = () => {
        if (calculations.debts.length === 0) {
            return `🐷 FairShare Summary\n\nTotal: ${currencySymbol}${calculations.totalSpent.toFixed(2)}\nPer person: ${currencySymbol}${calculations.fairShare.toFixed(2)}\n\n✅ All settled up!`;
        }

        let text = `🐷 FairShare Summary\n\n`;
        text += `💰 Total: ${currencySymbol}${calculations.totalSpent.toFixed(2)}\n`;
        text += `👥 Per person: ${currencySymbol}${calculations.fairShare.toFixed(2)}\n\n`;
        text += `📋 Settlement Plan:\n`;

        calculations.debts.forEach(debt => {
            text += `• ${debt.from} → ${debt.to}: ${currencySymbol}${debt.amount.toFixed(2)}\n`;
        });

        return text;
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generateShareText());
            alert('Settlement summary copied to clipboard!');
            setShowShareMenu(false);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'FairShare Settlement',
                    text: generateShareText()
                });
                setShowShareMenu(false);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        } else {
            copyToClipboard();
        }
    };

    // Calculations
    const calculations = useMemo(() => {
        const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const count = participants.length;
        const fairShare = count > 0 ? totalSpent / count : 0;

        const paidByPerson = {};
        participants.forEach(p => paidByPerson[p] = 0);
        expenses.forEach(e => {
            if (paidByPerson[e.payer] !== undefined) {
                paidByPerson[e.payer] += e.amount;
            }
        });

        const balances = participants.map(p => ({
            name: p,
            paid: paidByPerson[p],
            balance: paidByPerson[p] - fairShare
        }));

        const debts = [];
        let settlementBalances = balances.map(b => ({ ...b }));

        let debtors = settlementBalances.filter(b => b.balance < -0.01).sort((a, b) => a.balance - b.balance);
        let creditors = settlementBalances.filter(b => b.balance > 0.01).sort((a, b) => b.balance - a.balance);

        while (debtors.length > 0 && creditors.length > 0) {
            const debtor = debtors[0];
            const creditor = creditors[0];
            const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

            debts.push({
                from: debtor.name,
                to: creditor.name,
                amount: amount
            });

            debtor.balance += amount;
            creditor.balance -= amount;

            if (Math.abs(debtor.balance) < 0.01) debtors.shift();
            if (creditor.balance < 0.01) creditors.shift();
        }

        return { totalSpent, fairShare, balances, debts };
    }, [participants, expenses]);

    // Dynamic classes based on dark mode
    const bgClass = darkMode ? 'bg-slate-900' : 'bg-slate-50';
    const textClass = darkMode ? 'text-slate-100' : 'text-slate-800';
    const textMutedClass = darkMode ? 'text-slate-400' : 'text-slate-500';
    const textHeadingClass = darkMode ? 'text-emerald-400' : 'text-emerald-900';
    const borderClass = darkMode ? 'border-slate-700' : 'border-slate-200';
    const inputBgClass = darkMode ? 'bg-slate-700 text-slate-100 border-slate-600' : 'bg-white text-slate-800 border-slate-200';

    return (
        <div className={`min-h-screen ${bgClass} font-sans ${textClass} p-4 md:p-8 transition-colors duration-300`}>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className={`text-3xl font-bold ${textHeadingClass} flex items-center gap-2`}>
                            <PiggyBank className="w-8 h-8 text-emerald-600" />
                            FairShare
                        </h1>
                        <p className={`${textMutedClass} mt-1`}>
                            {typedText}
                            {typedText.length < fullGreeting.length && (
                                <span className="animate-pulse">|</span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-50'} border ${borderClass} transition-colors`}
                            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                        </button>

                        {/* Currency Picker */}
                        <div className="relative">
                            <button
                                onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
                                className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-50'} border ${borderClass} transition-colors flex items-center gap-2 text-sm ${textMutedClass}`}
                            >
                                <Settings className="w-4 h-4" />
                                {currencySymbol} {currency}
                            </button>
                            {showCurrencyPicker && (
                                <div className={`absolute right-0 mt-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-lg border py-2 z-10 min-w-[150px]`}>
                                    {Object.entries(CURRENCIES).map(([code, { symbol, name }]) => (
                                        <button
                                            key={code}
                                            onClick={() => {
                                                setCurrency(code);
                                                setShowCurrencyPicker(false);
                                            }}
                                            className={`w-full px-4 py-2 text-left text-sm ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} flex items-center gap-2 ${currency === code
                                                ? 'bg-emerald-500/20 text-emerald-500'
                                                : textClass
                                                }`}
                                        >
                                            <span className="font-medium">{symbol}</span>
                                            <span>{name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Navigation Tabs */}
                        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-1 rounded-lg shadow-sm border ${borderClass} inline-flex`}>
                            <button
                                onClick={() => setActiveTab('input')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'input'
                                    ? 'bg-emerald-600 text-white'
                                    : `${textMutedClass} hover:${textClass}`
                                    }`}
                            >
                                Add Data
                            </button>
                            <button
                                onClick={() => setActiveTab('results')}
                                disabled={participants.length < 2 || expenses.length === 0}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'results'
                                    ? 'bg-emerald-600 text-white'
                                    : `${textMutedClass} hover:${textClass} disabled:opacity-50`
                                    }`}
                            >
                                Settlement Plan
                            </button>
                        </div>
                    </div>
                </div>

                {activeTab === 'input' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Left Column: People & Add Expense */}
                        <div className="space-y-6">

                            {/* 1. Add People */}
                            <Card className="p-6" darkMode={darkMode}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className={`text-lg font-semibold flex items-center gap-2 ${textClass}`}>
                                        <Users className="w-5 h-5 text-emerald-600" />
                                        The Group
                                    </h2>
                                    <span className={`text-xs font-medium ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} px-2 py-1 rounded-full ${textMutedClass}`}>
                                        {participants.length} people
                                    </span>
                                </div>

                                <form onSubmit={addParticipant} className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="Enter name (e.g. Gustavo)"
                                        className={`flex-1 px-4 py-2 rounded-lg border ${inputBgClass} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all`}
                                    />
                                    <Button type="submit" variant="secondary" disabled={!newName.trim()} darkMode={darkMode}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </form>

                                <div className="flex flex-wrap gap-2">
                                    {participants.length === 0 && (
                                        <p className={`text-sm ${textMutedClass} italic`}>No one added yet.</p>
                                    )}
                                    {participants.map((person) => (
                                        <div key={person} className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} border pl-3 pr-1 py-1 rounded-full flex items-center gap-2 text-sm ${textClass}`}>
                                            <span>{person}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeParticipant(person)}
                                                className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* 2. Add Expense Form */}
                            <Card className="p-6" darkMode={darkMode}>
                                <h2 className={`text-lg font-semibold flex items-center gap-2 mb-4 ${textClass}`}>
                                    <Receipt className="w-5 h-5 text-emerald-600" />
                                    Log Expense
                                </h2>

                                {participants.length < 1 ? (
                                    <div className={`text-center py-6 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-lg border border-dashed ${borderClass}`}>
                                        <p className={`${textMutedClass} text-sm`}>Add people to the group first.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={addExpense} className="space-y-4">
                                        <div>
                                            <label className={`block text-xs font-medium ${textMutedClass} mb-1 uppercase tracking-wide`}>Who paid?</label>
                                            <select
                                                value={payer}
                                                onChange={(e) => setPayer(e.target.value)}
                                                className={`w-full px-4 py-2 rounded-lg border ${inputBgClass} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none`}
                                            >
                                                <option value="" disabled>Select a person</option>
                                                {participants.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className={`block text-xs font-medium ${textMutedClass} mb-1 uppercase tracking-wide`}>For what?</label>
                                            <input
                                                type="text"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="e.g. Dinner, Taxi, Groceries"
                                                className={`w-full px-4 py-2 rounded-lg border ${inputBgClass} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none`}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={`block text-xs font-medium ${textMutedClass} mb-1 uppercase tracking-wide`}>How much?</label>
                                                <div className="relative">
                                                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMutedClass}`}>{currencySymbol}</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === '-' || e.key === 'e') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        placeholder="0.00"
                                                        className={`w-full pl-8 pr-4 py-2 rounded-lg border ${inputBgClass} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-medium ${textMutedClass} mb-1 uppercase tracking-wide`}>When?</label>
                                                <div className="relative">
                                                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMutedClass}`} />
                                                    <input
                                                        type="date"
                                                        value={expenseDate}
                                                        onChange={(e) => setExpenseDate(e.target.value)}
                                                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${inputBgClass} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full" disabled={!payer || !amount || !description.trim()}>
                                            <Plus className="w-4 h-4" /> Add Expense
                                        </Button>
                                    </form>
                                )}
                            </Card>
                        </div>

                        {/* Right Column: Expense List */}
                        <div className="h-full">
                            <Card className="p-6 h-full min-h-[400px]" darkMode={darkMode}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-lg font-semibold flex items-center gap-2 ${textClass}`}>
                                        <DollarSign className="w-5 h-5 text-emerald-600" />
                                        History
                                    </h2>
                                    <div className="text-right">
                                        <p className={`text-xs ${textMutedClass} uppercase tracking-wide`}>Total Spent</p>
                                        <p className={`text-xl font-bold ${textHeadingClass}`}>{currencySymbol}{calculations.totalSpent.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                                    {expenses.length === 0 ? (
                                        <div className="text-center py-10 opacity-50">
                                            <Receipt className={`w-12 h-12 mx-auto mb-2 ${textMutedClass}`} />
                                            <p className={textMutedClass}>No expenses logged yet.</p>
                                        </div>
                                    ) : (
                                        expenses.map((expense) => (
                                            <div key={expense.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-slate-700/50 border-slate-600 hover:border-emerald-500/50' : 'bg-slate-50 border-slate-100 hover:border-emerald-200'} border transition-colors group`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                                                        {expense.payer.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium ${textClass}`}>{expense.description}</p>
                                                        <p className={`text-xs ${textMutedClass}`}>
                                                            <span className="font-semibold text-emerald-500">{expense.payer}</span>
                                                            {expense.date && <span> • {formatDate(expense.date)}</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`font-bold ${textClass}`}>{currencySymbol}{expense.amount.toFixed(2)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExpense(expense.id)}
                                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Clear All Button */}
                                {(participants.length > 0 || expenses.length > 0) && (
                                    <div className={`mt-6 pt-4 border-t ${borderClass}`}>
                                        <Button variant="danger" onClick={clearAllData} className="w-full" darkMode={darkMode}>
                                            <Trash2 className="w-4 h-4" /> Clear All Data
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-xl p-6 text-white shadow-lg">
                                <p className="text-emerald-200 text-sm font-medium uppercase tracking-wider mb-1">Total Group Spend</p>
                                <p className="text-4xl font-bold">{currencySymbol}{calculations.totalSpent.toFixed(2)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                                <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-1">Cost Per Person</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-bold">{currencySymbol}{calculations.fairShare.toFixed(2)}</p>
                                    <span className="text-sm opacity-80">/ each</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Who Pays Who (The Solution) */}
                            <Card className="lg:col-span-2 p-6 border-l-4 border-l-emerald-500" darkMode={darkMode}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-xl font-bold ${textClass} flex items-center gap-2`}>
                                        <RotateCcw className="w-6 h-6 text-emerald-600" />
                                        Settlement Plan
                                    </h2>

                                    {/* Share Button */}
                                    <div className="relative">
                                        <Button variant="secondary" onClick={() => setShowShareMenu(!showShareMenu)} darkMode={darkMode}>
                                            <Share2 className="w-4 h-4" /> Share
                                        </Button>
                                        {showShareMenu && (
                                            <div className={`absolute right-0 mt-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-lg shadow-lg border py-2 z-10 min-w-[180px]`}>
                                                <button
                                                    onClick={copyToClipboard}
                                                    className={`w-full px-4 py-2 text-left text-sm ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} flex items-center gap-2 ${textClass}`}
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Copy to Clipboard
                                                </button>
                                                {navigator.share && (
                                                    <button
                                                        onClick={shareNative}
                                                        className={`w-full px-4 py-2 text-left text-sm ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} flex items-center gap-2 ${textClass}`}
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                        Share...
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {calculations.debts.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-3xl">🎉</span>
                                        </div>
                                        <h3 className={`text-lg font-bold ${textHeadingClass}`}>All Settled Up!</h3>
                                        <p className={textMutedClass}>Everyone has paid exactly their fair share.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {calculations.debts.map((debt, index) => (
                                            <div key={index} className={`flex flex-col sm:flex-row items-center justify-between p-4 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-xl border ${borderClass}`}>
                                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-red-500">{debt.from}</span>
                                                        <span className={`${textMutedClass} text-sm`}>pays</span>
                                                        <span className="font-bold text-emerald-500">{debt.to}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                                                    <div className={`h-px ${darkMode ? 'bg-slate-600' : 'bg-slate-300'} flex-1 w-12 hidden sm:block`}></div>
                                                    <span className={`text-xl font-bold ${textClass} ${darkMode ? 'bg-slate-800' : 'bg-white'} px-3 py-1 rounded shadow-sm border ${borderClass}`}>
                                                        {currencySymbol}{debt.amount.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className={`mt-6 p-4 ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'} rounded-lg text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                                    <p><strong>Note:</strong> This is the most efficient way to settle debts, minimizing the number of transactions needed between the group.</p>
                                </div>
                            </Card>

                            {/* Balance Details */}
                            <Card className="p-6" darkMode={darkMode}>
                                <h3 className={`text-lg font-bold ${textClass} mb-4`}>Balance Sheet</h3>
                                <div className="space-y-4">
                                    {calculations.balances.map((person) => {
                                        const isOwed = person.balance > 0.01;
                                        const owes = person.balance < -0.01;

                                        return (
                                            <div key={person.name} className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-slate-700' : 'border-slate-50'} last:border-0`}>
                                                <div>
                                                    <p className={`font-semibold ${textClass}`}>{person.name}</p>
                                                    <p className={`text-xs ${textMutedClass}`}>Paid {currencySymbol}{person.paid.toFixed(2)}</p>
                                                </div>
                                                <div className={`text-right font-bold ${isOwed ? 'text-emerald-500' : owes ? 'text-red-500' : textMutedClass}`}>
                                                    {Math.abs(person.balance) < 0.01
                                                        ? "Settled"
                                                        : isOwed
                                                            ? `+ ${currencySymbol}${person.balance.toFixed(2)}`
                                                            : `- ${currencySymbol}${Math.abs(person.balance).toFixed(2)}`}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>

                        <div className="flex justify-center mt-8">
                            <Button variant="ghost" onClick={() => setActiveTab('input')} className="gap-2" darkMode={darkMode}>
                                <RotateCcw className="w-4 h-4" /> Edit Expenses
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
