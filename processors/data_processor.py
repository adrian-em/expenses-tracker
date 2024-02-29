
class DataProcessor:
    def load_and_process(self, filepath):
        data = self.load_data(filepath)
        data = self.rename_columns(data)
        data = self.format_data(data)
        return self.additional_processing(data)

    def load_data(self, filepath):
        raise NotImplementedError

    def rename_columns(self, data):
        raise NotImplementedError

    def format_data(self, data):
        raise NotImplementedError

    def additional_processing(self, data):
        return data
