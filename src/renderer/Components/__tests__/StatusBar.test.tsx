import { describe, expect, it } from "vitest";
import { render, within } from '@testing-library/react';
import { StatusBar } from "../StatusBar";

describe('StatusBar', () => {
    it('should display standard elements', () => {
        const { container } = render(<StatusBar />);

        const statusBar = within(container).getByRole('toolbar');
        expect(statusBar).toBeDefined();

        const applicationName = within(statusBar).getByLabelText('Application name');
        expect(applicationName).toHaveTextContent('GSPro SLX Proxy');
    });
});