import axiosConfig from "./API/axiosString";

// Import Types from Project
import { CodigoBarra } from "../types";

export const cadastrarCodigoBarra = async (data: CodigoBarra) => {
  try {
    const response = await axiosConfig.post(
      "/CodigoBarras/CadastrarScannerBarCode",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Não foi possível cadastrar o Código de Barras: ", error);
    return null;
  }
};
