import { render, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Settings } from '../Settings';

describe('Settings', () => {
  it('should render elements correctly', () => {
    const { container } = render(<Settings />);

    const gsproPortField = within(container).getByLabelText('GSPro Port (default 0921)');
    expect(gsproPortField).toBeInTheDocument();
    expect(gsproPortField).toHaveValue(922);
    expect(gsproPortField).toHaveAttribute('readonly', '');

    const saveButton = within(container).getByRole('button', {
      name: 'Save',
    });
    expect(saveButton).toBeInTheDocument();

    const resetButton = within(container).getByRole('button', {
      name: 'Reset',
    });
    expect(resetButton).toBeInTheDocument();
  });
});
