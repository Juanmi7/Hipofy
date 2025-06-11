import {Store} from 'pullstate';

interface UIStore {
  user: {
    firstName: string;
    lastName: string;
    acceptedTnC: boolean;
    invited: boolean;
  };
  preferences: {
    isDarkMode: boolean;
    pushNotifications: boolean;
  };
  list: {
    create: {
        id: string;
        status: string;
        products: Object[],
        productQuantity: number,
        prices: number
    }
  };
  router: {
    goToLogin: boolean
  }
}

const initialStore: UIStore = {
  user: {
    firstName: '',
    lastName: '',
    acceptedTnC: false,
    invited: true,
  },
  preferences: {
    isDarkMode: false,
    pushNotifications: false,
  },
  list: {
    create: {
        id: '',
        status: ''
    }
  },
  router: {
    goToLogin: false
  }
};

export const store = new Store<UIStore>({
  user: {
    firstName: '',
    lastName: '',
    acceptedTnC: false,
    invited: true,
  },
  preferences: {
    isDarkMode: false,
    pushNotifications: false,
  },
  list: {
    create: {
        id: '',
        status: ''
    }
  },
  router: {
    goToLogin: false
  }
});
