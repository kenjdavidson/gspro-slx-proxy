import type { ContextBridge } from "@common/ContextBridge";

export declare global {
    interface Window {
        ContextBridge: ContextBridge;
        port: Promise<MessagePort>
    }
}
