import datetime
import shutil
import os

def create_backup(original_path, backup_folder):
    if os.path.exists(original_path):
        today = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
        backup_filename = f'backup_{today}.csv'
        backup_path = os.path.join(backup_folder, backup_filename)
        shutil.copy(original_path, backup_path)
        print(f'Backup created at {backup_path}')
    else:
        print(f'No backup created. File {original_path} does not exist.')

def save(combined_data, output_csv_path):
    if 'PENDIENTE DE CATEGORIZAR' in combined_data['Categoria'].values:
        print('No se guarda el archivo CSV. Hay elementos pendientes de categorizar.')
        pending_rows = combined_data[combined_data['Categoria'] == 'PENDIENTE DE CATEGORIZAR']
        print("Filas pendientes de categorizar:")
        print(pending_rows)
    else:
        combined_data.to_csv(output_csv_path, index=False)
        print(f'Datos combinados guardados en {output_csv_path}')