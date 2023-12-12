export const GSPRO_PORT_STRING = "0921";
export const GSPRO_PORT = parseInt(GSPRO_PORT_STRING);

export type Config = {
    port: number
};

export const defaultConfig: Config = {
    port: GSPRO_PORT
};