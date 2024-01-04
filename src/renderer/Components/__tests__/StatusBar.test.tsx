import { ConnectionStatus } from '@common/ConnectionStatus';
import { render, within } from '@testing-library/react';
import { beforeEach } from 'node:test';
import { describe, expect, it, vitest } from 'vitest';
import { StatusBar } from '../StatusBar';

beforeEach(() => {
  vitest.resetAllMocks();
});

describe('StatusBar', () => {
  it('should display standard elements', () => {
    const { container } = render(
      <StatusBar gsproStatus={ConnectionStatus.Disconnected} monitorStatus={ConnectionStatus.Disconnected} />
    );

    const statusBar = within(container).getByRole('toolbar');
    expect(statusBar).toBeDefined();

    const applicationName = within(statusBar).getByLabelText('Connection status');
    expect(applicationName).toHaveTextContent('Connection status');

    const gspro = within(statusBar).getByLabelText('Not connected to GSPro');
    expect(gspro).toBeInTheDocument();

    const monitor = within(statusBar).getByLabelText('Not connected to SLX');
    expect(monitor).toBeInTheDocument();
  });

  it('should display correctly when connected', () => {
    const { container } = render(
      <StatusBar gsproStatus={ConnectionStatus.Connected} monitorStatus={ConnectionStatus.Connected} />
    );

    const statusBar = within(container).getByRole('toolbar');
    expect(statusBar).toBeDefined();

    const applicationName = within(statusBar).getByLabelText('Connection status');
    expect(applicationName).toHaveTextContent('Connection status');

    const gspro = within(statusBar).getByLabelText('Connected to GSPro');
    expect(gspro).toBeInTheDocument();

    const monitor = within(statusBar).getByLabelText('Connected to SLX');
    expect(monitor).toBeInTheDocument();
  });
});
