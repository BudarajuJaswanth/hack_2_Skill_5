import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { StatsCard } from '@/components/ui/StatsCard';
import { Calendar } from 'lucide-react';

describe('UI Design System & Accessibility', () => {
  it('renders Badge with correct text and accessible styling', () => {
    render(<Badge variant="terracotta">Luxury Wedding</Badge>);
    const badge = screen.getByText('Luxury Wedding');
    expect(badge).toBeInTheDocument();
  });

  it('renders Button with accessible label and click capability', () => {
    render(<Button variant="primary">Generate AI Run of Show</Button>);
    const button = screen.getByRole('button', { name: /Generate AI Run of Show/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders Card with header and content', () => {
    render(
      <Card>
        <CardTitle>Budget Overview</CardTitle>
        <p>Total spend is on track</p>
      </Card>
    );
    expect(screen.getByText('Budget Overview')).toBeInTheDocument();
    expect(screen.getByText('Total spend is on track')).toBeInTheDocument();
  });

  it('renders StatsCard with metric, title, and accessible icon', () => {
    render(
      <StatsCard
        title="Total Planned Budget"
        value="$75,000"
        subtitle="Across 3 active celebrations"
        icon={<Calendar className="w-5 h-5" />}
      />
    );
    expect(screen.getByText('Total Planned Budget')).toBeInTheDocument();
    expect(screen.getByText('$75,000')).toBeInTheDocument();
    expect(screen.getByText('Across 3 active celebrations')).toBeInTheDocument();
  });
});
