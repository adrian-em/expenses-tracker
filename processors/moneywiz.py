import pandas as pd
from processors.data_processor import DataProcessor

class MoneyWizProcessor(DataProcessor):
    def load_data(self, filepath):
        return pd.read_csv(filepath, sep=',')

    def rename_columns(self, data):
        column_rename_map = {
            'Descripción': 'Descripcion',
            'Importe': 'Importe',
            'Fecha': 'Fecha',
            'Cuentas': 'Cuenta',
            'Categoria': 'Categoria'
        }
        return data.rename(columns=column_rename_map)[list(column_rename_map.values())]

    def format_data(self, data):
        data['Importe'] = data['Importe'].str.replace(',', '.').astype(float)
        data['Fecha'] = pd.to_datetime(data['Fecha'], format='%d/%m/%Y').dt.strftime('%Y-%m-%d')
        return data

    def additional_processing(self, data):
        data['Tipo'] = data['Importe'].apply(lambda x: 'Ingreso' if x > 0 else 'Gasto')
        column_order = [
            'Fecha', 'Descripcion', 'Importe', 'Cuenta', 'Tipo', 'Categoria'
        ]
        data = data[column_order]
        return data
