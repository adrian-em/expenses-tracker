import pandas as pd
from processors.data_processor import DataProcessor

class RevolutProcessor(DataProcessor):
    def load_data(self, filepath):
        return pd.read_csv(filepath)

    def rename_columns(self, data):
        data = data.rename(columns={
            'Completed Date': 'Fecha',
            'Description': 'Descripcion',
            'Amount': 'Importe',
        })
        return data[
            ['Fecha', 'Descripcion', 'Importe']
        ]

    def format_data(self, data):
        data['Fecha'] = pd.to_datetime(data['Fecha']).dt.strftime('%Y-%m-%d')
        return data

    def additional_processing(self, data):
        data['Tipo'] = data['Importe'].apply(lambda x: 'Ingreso' if x > 0 else 'Gasto')
        data['Periodicidad'] = ''
        data['Etiquetas'] = ''
        data['Cuenta'] = 'revolut'
        return data