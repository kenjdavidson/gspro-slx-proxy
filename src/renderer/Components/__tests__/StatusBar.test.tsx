import { describe, expect, it } from "vitest";
import { render, within } from '@testing-library/react';
import { StatusBar } from "../StatusBar";

describe('StatusBar', () => {
    it('should display standard elements', () => {
        const { container } = render(<StatusBar />);

        const statusBar = within(container).getByRole('toolbar');
        expect(statusBar).toBeDefined();

        const applicationName = within(statusBar).getByLabelText('Connection status');
        expect(applicationName).toHaveTextContent('Connection status');

        const gspro = within(statusBar).getByLabelText('Not connected to GSPro');
        expect(gspro).toBeInTheDocument();

        const monitor = within(statusBar).getByLabelText('Not connected to SLX Connect');
        expect(monitor).toBeInTheDocument();
    });

    it('should display correctly when connected', () => {
        const { container } = render(
            <StatusBar gsproConnected={true} slxconnected={true} />
        );

        const statusBar = within(container).getByRole('toolbar');
        expect(statusBar).toBeDefined();

        const applicationName = within(statusBar).getByLabelText('Connection status');
        expect(applicationName).toHaveTextContent('Connection status');

        const gspro = within(statusBar).getByLabelText('Connected to GSPro');
        expect(gspro).toBeInTheDocument();

        const monitor = within(statusBar).getByLabelText('Connected to SLX Connect');
        expect(monitor).toBeInTheDocument();
    });

});