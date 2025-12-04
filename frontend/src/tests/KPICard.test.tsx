import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import KPICard from '../components/KPICard';
import { DollarSign } from 'lucide-react';

describe('KPICard Component', () => {
  it('renders title and value correctly', () => {
    render(
      <KPICard
        title="Total Revenue"
        value={1234567.89}
        format="currency"
        icon={DollarSign}
        trend={{ value: 12.5, isPositive: true }}
      />
    );

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,234,567.89')).toBeInTheDocument();
  });

  it('displays positive trend', () => {
    render(
      <KPICard
        title="Revenue"
        value={1000}
        format="currency"
        icon={DollarSign}
        trend={{ value: 5.2, isPositive: true }}
      />
    );

    expect(screen.getByText(/\+5\.2%/)).toBeInTheDocument();
  });

  it('displays negative trend', () => {
    render(
      <KPICard
        title="Revenue"
        value={1000}
        format="currency"
        icon={DollarSign}
        trend={{ value: -3.1, isPositive: false }}
      />
    );

    expect(screen.getByText(/-3\.1%/)).toBeInTheDocument();
  });
});
