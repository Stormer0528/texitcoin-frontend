import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config';

import { SvgColor } from 'src/components/SvgColor';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  admin: icon('ic_admin'),
  analytics: icon('ic_analytics'),
  banking: icon('ic_banking'),
  blog: icon('ic_blog'),
  blank: icon('ic_blank'),
  booking: icon('ic_booking'),
  calendar: icon('ic_calendar'),
  chat: icon('ic_chat'),
  dashboard: icon('ic_dashboard'),
  diagram: icon('ic_diagram'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  ecommerce: icon('ic_ecommerce'),
  file: icon('ic_file'),
  folder: icon('ic_folder'),
  invoice: icon('ic_invoice'),
  job: icon('ic_job'),
  kanban: icon('ic_kanban'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  mail: icon('ic_mail'),
  menuItem: icon('ic_menu_item'),
  order: icon('ic_order'),
  product: icon('ic_product'),
  package: icon('ic_package'),
  reward: icon('ic_reward'),
  sale: icon('ic_sale'),
  school: icon('ic_school'),
  tour: icon('ic_tour'),
  user: icon('ic_user'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'mineTXC Administration',
    items: [
      { title: 'Dashboard', path: paths.dashboard.history.root, icon: ICONS.analytics },
      { title: 'Sale', path: paths.dashboard.sales.root, icon: ICONS.sale },
      { title: 'Placement', path: paths.dashboard.placement.root, icon: ICONS.diagram },
      { title: 'Resource', path: paths.dashboard.resource.root, icon: ICONS.folder },
      { title: 'Reward', path: paths.dashboard.reward.root, icon: ICONS.reward },
      { title: 'Profile', path: paths.dashboard.profile.root, icon: ICONS.user },
    ],
  },
];
