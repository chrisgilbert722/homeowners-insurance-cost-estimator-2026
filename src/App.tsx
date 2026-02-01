import { useState } from 'react';

interface InsuranceInput {
    homeValue: number;
    state: string;
    homeType: 'single-family' | 'condo' | 'townhouse' | 'mobile';
    coverageLevel: 'basic' | 'standard' | 'premium';
    deductible: 500 | 1000 | 2500 | 5000;
}

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const BASE_RATE_PER_1K = 3.50;
const STATE_MULT: Record<string, number> = { FL: 1.85, LA: 1.75, TX: 1.55, OK: 1.50, KS: 1.45, MS: 1.40, AL: 1.35, CA: 1.30, CO: 1.25, DEFAULT: 1.00 };
const HOME_TYPE_MULT = { 'single-family': 1.00, condo: 0.75, townhouse: 0.85, mobile: 1.45 };
const COVERAGE_MULT = { basic: 0.75, standard: 1.00, premium: 1.35 };
const DEDUCTIBLE_MULT: Record<number, number> = { 500: 1.20, 1000: 1.00, 2500: 0.85, 5000: 0.70 };

const COVERAGE_SUMMARY: Record<string, string[]> = {
    basic: ['Dwelling protection only', 'Fire & weather damage', 'Basic liability', 'Lowest premium'],
    standard: ['Dwelling + contents', 'Personal property coverage', 'Standard liability', 'Additional living expenses'],
    premium: ['Full replacement cost', 'Extended coverage limits', 'Umbrella liability', 'Maximum protection']
};

const COVERAGE_DETAILS: Record<string, { label: string; included: boolean }[]> = {
    basic: [{ label: 'Dwelling Coverage', included: true }, { label: 'Other Structures', included: false }, { label: 'Personal Property', included: false }, { label: 'Liability Protection', included: true }, { label: 'Medical Payments', included: false }, { label: 'Additional Living Expenses', included: false }],
    standard: [{ label: 'Dwelling Coverage', included: true }, { label: 'Other Structures', included: true }, { label: 'Personal Property', included: true }, { label: 'Liability Protection', included: true }, { label: 'Medical Payments', included: true }, { label: 'Additional Living Expenses', included: true }],
    premium: [{ label: 'Dwelling Coverage', included: true }, { label: 'Other Structures', included: true }, { label: 'Personal Property', included: true }, { label: 'Liability Protection', included: true }, { label: 'Medical Payments', included: true }, { label: 'Additional Living Expenses', included: true }]
};

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(n);

function App() {
    const [values, setValues] = useState<InsuranceInput>({ homeValue: 350000, state: 'TX', homeType: 'single-family', coverageLevel: 'standard', deductible: 1000 });
    const handleChange = (field: keyof InsuranceInput, value: string | number) => setValues(prev => ({ ...prev, [field]: value }));

    const annual = Math.round((values.homeValue / 1000) * BASE_RATE_PER_1K * (STATE_MULT[values.state] || STATE_MULT.DEFAULT) * HOME_TYPE_MULT[values.homeType] * COVERAGE_MULT[values.coverageLevel] * DEDUCTIBLE_MULT[values.deductible]);
    const monthly = Math.round(annual / 12);
    const details = COVERAGE_DETAILS[values.coverageLevel];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Homeowners Insurance Cost Estimator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Get an instant estimate of your homeowners insurance premium</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="homeValue">Home Value ($)</label>
                            <input id="homeValue" type="number" min="50000" max="5000000" step="10000" value={values.homeValue || ''} onChange={(e) => handleChange('homeValue', parseInt(e.target.value) || 0)} placeholder="350000" />
                        </div>
                        <div>
                            <label htmlFor="state">State</label>
                            <select id="state" value={values.state} onChange={(e) => handleChange('state', e.target.value)}>
                                {STATES.map(st => <option key={st} value={st}>{st}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="homeType">Home Type</label>
                            <select id="homeType" value={values.homeType} onChange={(e) => handleChange('homeType', e.target.value)}>
                                <option value="single-family">Single Family</option>
                                <option value="condo">Condo</option>
                                <option value="townhouse">Townhouse</option>
                                <option value="mobile">Mobile Home</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="deductible">Deductible</label>
                            <select id="deductible" value={values.deductible} onChange={(e) => handleChange('deductible', parseInt(e.target.value))}>
                                <option value="500">$500</option>
                                <option value="1000">$1,000</option>
                                <option value="2500">$2,500</option>
                                <option value="5000">$5,000</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="coverageLevel">Coverage Level</label>
                        <select id="coverageLevel" value={values.coverageLevel} onChange={(e) => handleChange('coverageLevel', e.target.value)}>
                            <option value="basic">Basic (Dwelling Only)</option>
                            <option value="standard">Standard (HO-3)</option>
                            <option value="premium">Premium (HO-5)</option>
                        </select>
                    </div>
                    <button className="btn-primary" type="button">Get Estimate</button>
                </div>
            </div>

            <div className="card" style={{ background: '#F0F9FF', borderColor: '#BAE6FD' }}>
                <div className="text-center">
                    <h2 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Estimated Monthly Cost</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{fmt(monthly)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>per month</div>
                </div>
                <hr style={{ margin: 'var(--space-6) 0', border: 'none', borderTop: '1px solid #BAE6FD' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>ANNUAL COST</div>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{fmt(annual)}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>HOME VALUE</div>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>${fmtNum(values.homeValue)}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Coverage Level Summary</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {COVERAGE_SUMMARY[values.coverageLevel].map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Coverage Details</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {details.map((d, i) => (
                            <tr key={i} style={{ borderBottom: i === details.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: i % 2 ? '#F8FAFC' : 'transparent' }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)' }}>{d.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: d.included ? '#10B981' : '#94A3B8' }}>{d.included ? 'Included' : 'Not Included'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This tool provides an informational estimate of homeowners insurance costs based on common rating factors such as home value, location, home type, coverage level, and deductible. The figures shown are estimates only. Actual insurance premiums vary based on home age, construction materials, claims history, and insurer criteria. Contact licensed providers for accurate quotes.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Actual premiums vary</li><li>• Free to use</li>
                </ul>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Homeowners Insurance Cost Estimator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
