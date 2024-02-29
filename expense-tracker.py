import pandas as pd
from config import  infer_categories_data, overall_classification, default_values
import os
from processors.moneywiz import MoneyWizProcessor
from processors.ing import IngProcessor
from processors.revolut import RevolutProcessor
from utils.utils import create_backup, save
from enhancer.data_enhancer import DataEnhancer


# Paths to the files (you will need to set these to the correct paths for your files)
# moneywiz_path = '../data/moneywiz.csv'
ing_micuenta = '../data/ing_micuenta.xls'
ing_conjunta = '../data/ing_conjunta.xls'
revolut_path = '../data/revolut.csv'
ing_nomina = '../data/ing_nomina.xls'
# ing_inversiones = '../data/ing_inversiones.xls'

# moneywiz_processor = MoneyWizProcessor()
ing_processor_mine = IngProcessor('mi cuenta')
ing_processor_joined = IngProcessor('adma')
revolut_processor = RevolutProcessor()
# ing_processor_nomina = IngProcessor('mi cuenta')
# ing_processor_inversiones = IngProcessor('mi cuenta')

# movimientos_data = moneywiz_processor.load_and_process(moneywiz_path)
ing_data_mine = ing_processor_mine.load_and_process(ing_micuenta)
ing_data_joined = ing_processor_joined.load_and_process(ing_conjunta)
revolut_data = revolut_processor.load_and_process(revolut_path)
# ing_data_nomina = ing_processor_nomina.load_and_process(ing_nomina)
# ing_data_inversiones = ing_processor_inversiones.load_and_process(ing_inversiones)

data_enhancer = DataEnhancer(infer_categories_data, overall_classification)

# combined_data = data_enhancer.unify_dataframes([movimientos_data, ing_data_mine, ing_data_joined, revolut_data, ing_data_nomina, ing_data_inversiones])
# combined_data = data_enhancer.unify_dataframes([ing_data_mine, ing_data_joined, revolut_data, ing_data_nomina])
combined_data = data_enhancer.unify_dataframes([ing_data_mine, ing_data_joined, revolut_data])

combined_data_filled = data_enhancer.fill_default_values(combined_data, default_values)
combined_data_filled = data_enhancer.classify_transaction_type(combined_data_filled)
combined_data_filled = data_enhancer.apply_tags(combined_data_filled)
combined_data_filled = data_enhancer.update_categories(combined_data_filled)
combined_data_filled = data_enhancer.apply_split_category_subcategory(combined_data_filled)
combined_data_filled = data_enhancer.apply_conditional_inference(combined_data_filled)
combined_data_filled = data_enhancer.apply_overall_classification(combined_data_filled)

output_csv_path = '../data/combined_financial_data.csv'
create_backup(output_csv_path, '../data/backup')

if os.path.exists(output_csv_path):
    existing_data = pd.read_csv(output_csv_path)
    combined_data = pd.concat([existing_data, combined_data_filled], ignore_index=True)
else:
    combined_data = combined_data_filled

save(combined_data, output_csv_path)