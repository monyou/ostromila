type LocaleMetaInfo = {
  meta_title: string;
  meta_content: string;
};

export type Locale = {
  HomePage: LocaleMetaInfo & {
    title: string;
  };
  NotFoundPage: LocaleMetaInfo & {
    text_logo: string;
    text: string;
    go_back: string;
  };
  AccessDeniedPage: LocaleMetaInfo & {
    title: string;
    go: string;
    back: string;
  };
  BuildingPage: (buildingNumber: string) => LocaleMetaInfo & {
    title: string;
    apartment: string;
    news: string;
    report: string;
    prevMonthReportNotReady: string;
  };
  AdminPage: LocaleMetaInfo & {
    title: string;
    panel: {
      title1: string;
      title2: string;
      title3: string;
    };
    pick_building: string;
    pick_month: string;
    apartment_title: (apartmentNumber: number) => string;
    tax_title: (tax: number) => string;
    paid: string;
    unpaid: string;
    reports: {
      yearly_btn: string;
      monthly_btn: string;
    };
  };
  LoginPage: LocaleMetaInfo & {
    title: string;
    username: {
      label: string;
      error: string;
    };
    password: {
      label: string;
      error: string;
    };
    submit: string;
  };
  MainLayout: {
    MenuItem1: string;
    MenuItem2: string;
    MenuItem3: string;
  };
  Globals: {
    short_month_names: string[];
    user_types: {
      HouseManager: string;
      Cashier: string;
      Guest: string;
    };
    information: string;
  };
  ApiErrors: Record<string, string>;
};

const locales: Record<string, Locale> = {
  bg: {
    HomePage: {
      meta_title: "Начало",
      meta_content: "Начална страница",
      title: "Добре дошли!",
    },
    NotFoundPage: {
      meta_title: "404",
      meta_content: "Страницата не е намерена",
      text_logo: "404",
      text: "Няма какво да се види тук,",
      go_back: "ВЪРНИ СЕ",
    },
    AccessDeniedPage: {
      meta_title: "403",
      meta_content:
        "Страницата не може да бъде достъпена тъй като не са налични администраторски права",
      title: "Нямате достъп до тази страница",
      go: "Върнете се",
      back: "ОБРАТНО",
    },
    BuildingPage: (buildingNumber) => ({
      meta_title: `Блок ${buildingNumber} | Инфо`,
      meta_content: `Информация за блок ${buildingNumber}`,
      title: `Блок ${buildingNumber}`,
      apartment: "Апартамент",
      news: "Новини",
      report: "Отчет до момента за",
      prevMonthReportNotReady: "Отчетът за миналия месец се генерира",
    }),
    AdminPage: {
      meta_title: "Администрация",
      meta_content:
        "Страница на администратора, която дава възможност за промяна на различни данни свързани с всеки блок.",
      title: "Администрация",
      panel: {
        title1: "Събиране на такси",
        title2: "Отчети",
        title3: "Новини",
      },
      apartment_title: (apartmentNumber) => `Ап. ${apartmentNumber}`,
      paid: "Платено",
      pick_building: "Изберете блок",
      pick_month: "Изберете месец",
      reports: {
        monthly_btn: "Месечен отчет",
        yearly_btn: "Годишен отчет",
      },
      tax_title: (tax) => `Такса ${tax} лв.`,
      unpaid: "Неплатено",
    },
    LoginPage: {
      meta_title: "Вход",
      meta_content: "Страница за вход на потребители",
      title: "Вход",
      username: {
        label: "Потребителско име",
        error: "Моля въведете потребителско име!",
      },
      password: {
        label: "Парола",
        error: "Моля въведете парола!",
      },
      submit: "Вход",
    },
    MainLayout: {
      MenuItem1: "Остромила 144",
      MenuItem2: "Остромила 146",
      MenuItem3: "Администрация",
    },
    Globals: {
      short_month_names: [
        "Ян",
        "Февр",
        "Март",
        "Апр",
        "Май",
        "Юни",
        "Юли",
        "Авг",
        "Септ",
        "Окт",
        "Ноем",
        "Дек",
      ],
      user_types: {
        HouseManager: "Домоуправител",
        Cashier: "Касиер",
        Guest: "Гост",
      },
      information: "Информация",
    },
    ApiErrors: {
      "403": "Забранен достъп",
      "405": "Неправилен метод",
      "500": "Сървърна грешка",

      "691": "Няма такъв потребител",
    },
  },
};

export default locales;
