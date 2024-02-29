infer_categories_data = {
    'paypal': ('PENDIENTE DE CATEGORIZAR', ''),
    'pago en amazon': ('PENDIENTE DE CATEGORIZAR', ''),
    'pago en amzn': ('PENDIENTE DE CATEGORIZAR', ''),
    '%otros gastos%': ('Otros gastos', ''),
    'ibkr': ('Inversiones', ''),
    'libro': ('Desarrollo Personal', 'Libros'),
    'kinepolis': ('Tiempo libre', 'Ocio'),
    'tatuaje': ('Tatuaje', 'Tatuaje'),
    'mascota': ('Mascota', 'Mascota'),
    'pago en books center': ('Desarrollo Personal', 'Libros'),
    'pago en kindle svcs': ('Desarrollo Personal', 'Libros'),
}


overall_classification = {
    'Necesidades': [
        'Facturas',
        'Asistencia sanitaria',
        'Automovil',
        'Transporte',
        'Alimentacion',
        'Vivienda',
        'Hogar',
        'Préstamos',
        'Comisiones',
        'Impuestos',
        'Mascota',
    ],
    'Deseos': [
        'Tiempo libre',
        'Restaurantes',
        'Regalos',
        'Vestimenta',
        'Tatuaje',
        'Viajes',
        'Compras',
        'Digital',
        'Otros gastos',
        'Otro',
        'Objetos',
        'Otros gastos (otros)',
        'Donacion',
        'Desarrollo Personal',
    ],
    'Inversiones': [
        'Inversiones',
    ],
}

default_values = {
    'Categoria': 'Unknown',
    'Subcategoria': 'Unknown',
    'Tipo': 'Unknown',
    'Cuenta': 'Unknown',
    'Periodicidad': 'Unknown',
    'Etiquetas': 'Unknown'
}