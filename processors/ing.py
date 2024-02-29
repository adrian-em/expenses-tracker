import pandas as pd
from processors.data_processor import DataProcessor

class IngProcessor(DataProcessor):
    def __init__(self, bank_account):
        self.bank_account = bank_account

    def load_data(self, filepath):
        return pd.read_excel(filepath)

    def rename_columns(self, data):
        column_rename_map = {
            'F. VALOR': 'Fecha',
            'CATEGORÍA': 'Categoria', 
            'SUBCATEGORÍA': 'Subcategoria', 
            'DESCRIPCIÓN': 'Descripcion', 
            'COMENTARIO': 'Comentario', 
            'IMPORTE (€)': 'Importe'
        }
        pos = 0
        # goddamn ing, excel, numbers and everything
        while 'F. VALOR' not in str(data.iloc[pos].values[0]):
            pos += 1
        # if type(data.iloc[pos].values[0]) == float:
        #     pos = 4

        data.columns = data.iloc[pos]
        data = data.drop(data.index[:4])
        return data.rename(columns=column_rename_map)

    def format_data(self, data):
        # Verificar que las columnas esperadas existan
        expected_columns = ['Fecha', 'Descripcion', 'Importe', 'Categoria', 'Subcategoria']
        actual_columns = data.columns.tolist()
        
        missing_columns = [col for col in expected_columns if col not in actual_columns]
        if missing_columns:
            raise ValueError(f"Las siguientes columnas esperadas están faltando: {missing_columns}")
        
        # Continuar procesamiento si todas las columnas están presentes
        return data[expected_columns]

    def additional_processing(self, data):
        data['Cuenta'] = self.bank_account
        return data