class LoadingService {
  _loading: boolean = false;

  changedCallback: (val: boolean) => void = () => {};

  set loading(value: boolean) {
    this.changedCallback(value);
    this._loading = value;
  }

  get loading() {
    return this._loading;
  }
}

export const loadingService = new LoadingService();
