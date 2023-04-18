import Country from '@/components/Country';
import Fitimg from '@/components/Fitimg';
import Privacy from '@/components/privacyPolicy';

const components = {
  Country,
  Fitimg,
  Privacy
};

const install = function (Vue) {
  Object.keys(components).forEach(key => {
    Vue.component(key, components[key]);
  });
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const rcUI = {
  install,
};

export default rcUI;
