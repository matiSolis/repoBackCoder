import { v4 as uuidv4 } from 'uuid';

// GENERADOR DE CODIGO UNICO Y AUTOMATICO

export const code = async () => {
  const code = uuidv4();
  return code;
};
