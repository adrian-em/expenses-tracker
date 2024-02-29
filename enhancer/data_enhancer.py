import pandas as pd


class DataEnhancer:
    def __init__(self, infer_categories_data, overall_classification):
        self.infer_categories_data = infer_categories_data
        self.overall_classification = overall_classification

    @staticmethod
    def _is_convertible_to_float(value):
        try:
            float(value)
            return True
        except ValueError:
            return False


    def unify_dataframes(self, df_list):
        combined_data = pd.concat(df_list, ignore_index=True)
        combined_data['Importe'] = combined_data['Importe'].replace({',': '.'}, regex=True)
        combined_data = combined_data[combined_data['Importe'].apply(DataEnhancer._is_convertible_to_float)]
        combined_data['Importe'] = combined_data['Importe'].astype(float)
        return combined_data

    def fill_default_values(self, data, default_values):
        return data.fillna(default_values)

    def classify_transaction_type(self, data):
        data['Tipo'] = data.apply(
            lambda row: 'Ingreso' if row['Importe'] > 0 else ('Gasto' if row['Importe'] < 0 else 'Unknown'), 
            axis=1
        )
        return data

    def infer_tags(self, description):
        if pd.isnull(description) or not isinstance(description, str):
            return ''
        keywords_tags = {
            'alquiler': 'vivienda',
            'supermercado': 'alimentacion',
            'restaurante': 'restaurante',
            'transferencia': 'transferencias',
            'nómina': 'ingresos',
            'sueldo': 'ingresos',
            'compra': 'compras',
            'venta': 'ventas',
            'pago': 'pagos',
            'tarjeta': 'tarjeta'
        }
        tags = [tag for keyword, tag in keywords_tags.items() if keyword in description.lower()]
        return ', '.join(tags)

    def apply_tags(self, data):
        data['Etiquetas'] = data['Descripcion'].apply(self.infer_tags)
        return data

    def infer_category_subcategory(self, row):
        description, current_category, current_subcategory = row['Descripcion'], row['Categoria'], row['Subcategoria']
        inferred_category = 'PENDIENTE DE CATEGORIZAR'
        inferred_subcategory = ''
        if pd.notnull(description) and isinstance(description, str):
            for keyword, (category, subcategory) in self.infer_categories_data.items():
                if keyword in description.lower():
                    return category, subcategory

        if current_category not in ['Unknown', 'PENDIENTE DE CATEGORIZAR']:
            return current_category, current_subcategory
        return inferred_category, inferred_subcategory

    def update_categories(self, data):
        data[['Categoria', 'Subcategoria']] = data.apply(
            self.infer_category_subcategory, axis=1, result_type='expand'
        )
        return data

    def classify_overall(self, category):
        for classification, categories in self.overall_classification.items():
            if category in categories:
                return classification
        return 'Unknown'

    def apply_overall_classification(self, data):
        data['Overall'] = data['Categoria'].apply(self.classify_overall)
        return data

    def split_category_subcategory(self, row):
        if '>' in row['Categoria']:
            category, subcategory = row['Categoria'].split(' > ', 1)  # Split en el primer '>'
            return category.strip(), subcategory.strip()
        else:
            return row['Categoria'], row['Subcategoria']

    def apply_split_category_subcategory(self, data):
        data[['Categoria', 'Subcategoria']] = data.apply(
            self.split_category_subcategory, axis=1, result_type='expand'
        )
        return data

    def infer_category_conditionally(self, row):
        description, amount, current_category, current_subcategory, cuenta = \
            row['Descripcion'], row['Importe'], row['Categoria'], row['Subcategoria'], row['Cuenta']
        if pd.notna(description) and isinstance(description, str):
            if description.lower() == 'traspaso interno emitido' and -900 <= amount <= -600 and cuenta == 'adma':
                return 'Vivienda', 'Alquiler'
        return current_category, current_subcategory

    def apply_conditional_inference(self, data):
        data[['Categoria', 'Subcategoria']] = data.apply(
            self.infer_category_conditionally, axis=1, result_type='expand'
        )
        return data
