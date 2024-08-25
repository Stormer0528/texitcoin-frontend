import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

export const _account = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.32">
          <path
            d="M2.60946 22.9843C1.77292 22.9631 1.13928 22.4599 1.07089 21.6259C1.02993 21.1264 1 20.4398 1 19.5C1 18.5602 1.02993 17.8736 1.07089 17.3741C1.13928 16.5401 1.77292 16.0369 2.60946 16.0157C2.97545 16.0064 3.43306 16 4 16C4.56694 16 5.02455 16.0064 5.39055 16.0157C6.2271 16.0369 6.8607 16.5401 6.9291 17.3741C6.97005 17.8736 7 18.5602 7 19.5C7 20.4398 6.97005 21.1264 6.9291 21.6259C6.8607 22.4599 6.2271 22.9631 5.39055 22.9843C5.02455 22.9936 4.56694 23 4 23C3.43306 23 2.97545 22.9936 2.60946 22.9843Z"
            fill="#637381"
          />
          <path
            d="M18.8455 22.9792C17.8709 22.9408 17.1875 22.2557 17.1243 21.2823C17.0588 20.2731 17 18.6337 17 16C17 13.3663 17.0588 11.727 17.1243 10.7177C17.1875 9.74435 17.8709 9.0592 18.8455 9.02075C19.1671 9.00805 19.5489 9 20 9C20.4511 9 20.8329 9.00805 21.1545 9.02075C22.1291 9.0592 22.8125 9.74435 22.8757 10.7177C22.9412 11.727 23 13.3663 23 16C23 18.6337 22.9412 20.2731 22.8757 21.2823C22.8125 22.2557 22.1291 22.9408 21.1545 22.9792C20.8329 22.9919 20.4511 23 20 23C19.5489 23 19.1671 22.9919 18.8455 22.9792Z"
            fill="#637381"
          />
          <path
            d="M10.7766 22.9832C9.8427 22.9548 9.162 22.3419 9.0949 21.41C9.0422 20.6775 9 19.5936 9 18C9 16.4064 9.0422 15.3225 9.0949 14.59C9.162 13.6581 9.8427 13.0453 10.7766 13.0169C11.1121 13.0067 11.5163 13 12 13C12.4837 13 12.8879 13.0067 13.2234 13.0169C14.1573 13.0453 14.838 13.6581 14.9051 14.59C14.9578 15.3225 15 16.4064 15 18C15 19.5936 14.9578 20.6775 14.9051 21.41C14.838 22.3419 14.1573 22.9548 13.2234 22.9832C12.8879 22.9934 12.4837 23 12 23C11.5163 23 11.1121 22.9934 10.7766 22.9832Z"
            fill="#637381"
          />
        </g>
        <path
          d="M20.9603 6.0506C20.9106 7.03855 19.9709 7.40975 19.242 6.741C18.9106 6.4369 18.5138 6.06255 18.0418 5.60285C16.9756 6.5731 15.322 8.08585 13.3506 9.91645C12.8329 10.3972 11.992 10.3435 11.5397 9.8007L11.5394 9.8003C10.6518 8.73835 9.75755 7.6807 8.8322 6.6514C7.7509 7.4453 5.81 8.95825 3.88389 10.8844C3.39573 11.3725 2.60427 11.3725 2.11612 10.8844C1.62796 10.3962 1.62796 9.60475 2.11612 9.1166C4.00573 7.227 6.079 5.4545 8.30255 3.96314L8.306 3.96082C8.30685 3.96027 8.3066 3.96042 8.3066 3.96042C8.8024 3.6299 9.46255 3.69527 9.8839 4.1166C10.8519 5.08455 11.7265 6.14925 12.6118 7.19265C14.1169 5.80065 15.3848 4.64087 16.274 3.8314C15.8705 3.41506 15.5362 3.06006 15.26 2.75898C14.591 2.02997 14.9624 1.08998 15.9506 1.04025C17.2115 0.976795 18.5055 0.939456 19.7511 1.17232C20.3119 1.27718 20.7233 1.68863 20.8281 2.24948C21.061 3.49521 21.0238 4.78949 20.9603 6.0506Z"
          fill="#637381"
        />
      </svg>
    ),
  },
  {
    label: 'Sale',
    href: '/sales',
    icon: <Iconify icon="hugeicons:sale-tag-01" />,
  },
  {
    label: 'Placement',
    href: '/placement',
    icon: <Iconify icon="clarity:flow-chart-line" />,
  },
  {
    label: 'Resource',
    href: '/resource',
    icon: <Iconify icon="lucide:folder-open" />,
  },
  {
    label: 'Reward',
    href: '/reward',
    icon: <Iconify icon="marketeq:reward" />,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: <Iconify icon="heroicons:user" />,
  },
];
