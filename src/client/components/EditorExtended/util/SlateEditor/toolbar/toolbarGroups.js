import React from 'react';
import { REMOVE_FORMAT } from '../utils/constants';

const toolbarGroups = [
  {
    label: 'H1',
    description: 'Heading 1',
    page: 1,
    type: 'block',
    format: 'headingOne',
  },
  {
    label: 'H2',
    description: 'Heading 2',
    page: 1,
    type: 'block',
    format: 'headingTwo',
  },
  {
    label: 'H3',
    description: 'Heading 3',
    page: 2,
    type: 'block',
    format: 'headingThree',
  },
  {
    label: 'H4',
    description: 'Heading 4',
    page: 2,
    type: 'block',
    format: 'headingFour',
  },
  {
    label: (
      <svg width="10.83" height="10" viewBox="0 0 13 12">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-357.000000, -255.000000)" fill="#FFFFFF">
            <g transform="translate(260.000000, 165.000000)">
              <g transform="translate(0.000000, 75.000000)">
                <g transform="translate(19.000000, 0.000000)">
                  <path d="M90.500768,15 L91,15.56 C88.9631235,17.0533408 87.9447005,18.666658 87.9447005,20.4 C87.9447005,21.8800074 88.75012,23.1466614 90.3609831,24.2 L87.5453149,27 C85.9211388,25.7866606 85.109063,24.346675 85.109063,22.68 C85.109063,20.3199882 86.90628,17.7600138 90.500768,15 Z M83.3917051,15 L83.890937,15.56 C81.8540605,17.0533408 80.8356375,18.666658 80.8356375,20.4 C80.8356375,21.8800074 81.6344006,23.1466614 83.2319508,24.2 L80.4362519,27 C78.8120759,25.7866606 78,24.346675 78,22.68 C78,20.3199882 79.7972171,17.7600138 83.3917051,15 Z" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    ),
    description: 'Blockquote',
    type: 'block',
    format: 'blockquote',
    page: 3,
  },
  {
    label: <strong className="toolbar_button-strong">B</strong>,
    description: 'Bold',
    page: 1,
    type: 'inline',
    format: 'strong',
  },
  {
    label: <i>I</i>,
    description: 'Italic',
    page: 1,
    type: 'inline',
    format: 'emphasis',
  },
  {
    label: (
      <svg
        width="25"
        height="13"
        viewBox="0 0 33 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.77908 5.95202H31.8537C32.0598 5.95202 32.2585 5.92316 32.4045 5.87186C32.5506 5.82057 32.6328 5.75095 32.6328 5.67845L32.632 4.27356C32.632 4.12256 32.283 4 31.853 4H8.77908C8.34903 4 8 4.12256 8 4.27356V5.67845C8 5.82946 8.34864 5.95202 8.77908 5.95202Z"
          fill="white"
        />
        <path
          d="M8.77908 14.9516H31.8537C32.0598 14.9516 32.2584 14.9228 32.4045 14.8715C32.5506 14.8202 32.6328 14.7506 32.6328 14.6781L32.632 13.2735C32.632 13.1225 32.283 13 31.8529 13H8.77908C8.34903 13 8 13.1225 8 13.2735V14.6781C8 14.8291 8.34864 14.9516 8.77908 14.9516Z"
          fill="white"
        />
        <path
          d="M8.77908 23.9516H31.8537C32.0598 23.9516 32.2584 23.9228 32.4045 23.8715C32.5506 23.8202 32.6328 23.7506 32.6328 23.6781L32.632 22.2735C32.632 22.1225 32.283 22 31.8529 22H8.77908C8.34903 22 8 22.1225 8 22.2735V23.6781C8 23.8291 8.34864 23.9516 8.77908 23.9516Z"
          fill="white"
        />
        <path
          d="M2.76705 2.18182V8H1.88636V3.0625H1.85227L0.460227 3.97159V3.13068L1.91193 2.18182H2.76705Z"
          fill="white"
        />
        <path
          d="M2.58523 25.3881C2.19508 25.3881 1.84659 25.3209 1.53977 25.1864C1.23485 25.052 0.993371 24.8654 0.815341 24.6268C0.639205 24.3862 0.544508 24.1078 0.53125 23.7915H1.4233C1.43466 23.9639 1.49242 24.1135 1.59659 24.2404C1.70265 24.3654 1.84091 24.462 2.01136 24.5302C2.18182 24.5984 2.37121 24.6325 2.57955 24.6325C2.80871 24.6325 3.01136 24.5927 3.1875 24.5131C3.36553 24.4336 3.50473 24.3228 3.60511 24.1808C3.70549 24.0368 3.75568 23.8711 3.75568 23.6836C3.75568 23.4885 3.70549 23.3171 3.60511 23.1694C3.50663 23.0198 3.36174 22.9023 3.17045 22.8171C2.98106 22.7319 2.75189 22.6893 2.48295 22.6893H1.99148V21.9734H2.48295C2.69886 21.9734 2.88826 21.9345 3.05114 21.8569C3.21591 21.7792 3.3447 21.6713 3.4375 21.533C3.5303 21.3929 3.5767 21.229 3.5767 21.0415C3.5767 20.8616 3.53598 20.7054 3.45455 20.5728C3.375 20.4383 3.26136 20.3332 3.11364 20.2575C2.9678 20.1817 2.79545 20.1438 2.59659 20.1438C2.4072 20.1438 2.23011 20.1789 2.06534 20.2489C1.90246 20.3171 1.76989 20.4156 1.66761 20.5444C1.56534 20.6713 1.51042 20.8237 1.50284 21.0018H0.653409C0.662879 20.6874 0.755682 20.4109 0.931818 20.1722C1.10985 19.9336 1.3447 19.747 1.63636 19.6126C1.92803 19.4781 2.25189 19.4109 2.60795 19.4109C2.98106 19.4109 3.30303 19.4838 3.57386 19.6296C3.84659 19.7736 4.05682 19.9658 4.20455 20.2063C4.35417 20.4469 4.42803 20.7101 4.42614 20.9961C4.42803 21.3219 4.33712 21.5984 4.15341 21.8256C3.97159 22.0529 3.72917 22.2054 3.42614 22.283V22.3285C3.8125 22.3872 4.11174 22.5406 4.32386 22.7887C4.53788 23.0368 4.64394 23.3446 4.64205 23.712C4.64394 24.0321 4.55492 24.319 4.375 24.5728C4.19697 24.8266 3.9536 25.0264 3.64489 25.1722C3.33617 25.3162 2.98295 25.3881 2.58523 25.3881Z"
          fill="white"
        />
        <path
          d="M0.559659 16.1562V15.5199L2.52841 13.4801C2.73864 13.2585 2.91193 13.0644 3.0483 12.8977C3.18655 12.7292 3.28977 12.5691 3.35795 12.4176C3.42614 12.2661 3.46023 12.1051 3.46023 11.9347C3.46023 11.7415 3.41477 11.5748 3.32386 11.4347C3.23295 11.2926 3.1089 11.1837 2.9517 11.108C2.79451 11.0303 2.61742 10.9915 2.42045 10.9915C2.21212 10.9915 2.0303 11.0341 1.875 11.1193C1.7197 11.2045 1.60038 11.3248 1.51705 11.4801C1.43371 11.6354 1.39205 11.8172 1.39205 12.0256H0.553977C0.553977 11.6714 0.635417 11.3617 0.798295 11.0966C0.961174 10.8314 1.18466 10.6259 1.46875 10.4801C1.75284 10.3324 2.07576 10.2585 2.4375 10.2585C2.80303 10.2585 3.125 10.3314 3.40341 10.4773C3.68371 10.6212 3.90246 10.8182 4.05966 11.0682C4.21686 11.3163 4.29545 11.5966 4.29545 11.9091C4.29545 12.125 4.25473 12.3362 4.1733 12.5426C4.09375 12.7491 3.95455 12.9792 3.75568 13.233C3.55682 13.4848 3.2803 13.7907 2.92614 14.1506L1.76989 15.3608V15.4034H4.3892V16.1562H0.559659Z"
          fill="white"
        />
      </svg>
    ),
    format: 'orderedList',
    type: 'block',
    page: 3,
  },
  {
    label: (
      <svg
        width="25"
        height="13"
        viewBox="0 0 33 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.49628 5C3.87494 5 4.99256 3.88071 4.99256 2.5C4.99256 1.11929 3.87494 0 2.49628 0C1.11762 0 0 1.11929 0 2.5C0 3.88071 1.11762 5 2.49628 5Z"
          fill="white"
        />
        <path
          d="M9.59438 3.23583H32.1882C32.3899 3.23583 32.5845 3.20624 32.7275 3.15365C32.8705 3.10105 32.951 3.02967 32.951 2.95534L32.9502 1.51487C32.9502 1.36004 32.6085 1.23438 32.1874 1.23438H9.59438C9.1733 1.23438 8.83154 1.36004 8.83154 1.51487V2.95534C8.83154 3.11017 9.17291 3.23583 9.59438 3.23583Z"
          fill="white"
        />
        <path
          d="M2.49628 14C3.87494 14 4.99256 12.8807 4.99256 11.5C4.99256 10.1193 3.87494 9 2.49628 9C1.11762 9 0 10.1193 0 11.5C0 12.8807 1.11762 14 2.49628 14Z"
          fill="white"
        />
        <path
          d="M9.64345 12.5714H32.2372C32.439 12.5714 32.6335 12.5418 32.7765 12.4892C32.9196 12.4366 33.0001 12.3653 33.0001 12.2909L32.9993 10.8508C32.9993 10.6959 32.6575 10.5703 32.2365 10.5703H9.64345C9.22237 10.5703 8.88062 10.6959 8.88062 10.8508V12.2909C8.88062 12.4457 9.22199 12.5714 9.64345 12.5714Z"
          fill="white"
        />
        <path
          d="M2.49628 23C3.87494 23 4.99256 21.8807 4.99256 20.5C4.99256 19.1193 3.87494 18 2.49628 18C1.11762 18 0 19.1193 0 20.5C0 21.8807 1.11762 23 2.49628 23Z"
          fill="white"
        />
        <path
          d="M9.59438 21.8331H32.1881C32.3899 21.8331 32.5844 21.8035 32.7275 21.7509C32.8705 21.6984 32.951 21.627 32.951 21.5527L32.9502 20.1125C32.9502 19.9577 32.6085 19.832 32.1874 19.832H9.59438C9.17329 19.832 8.83154 19.9577 8.83154 20.1125V21.5527C8.83154 21.7075 9.17291 21.8331 9.59438 21.8331Z"
          fill="white"
        />
      </svg>
    ),
    format: 'unorderedList',
    type: 'block',
    page: 3,
  },
  {
    label: (
      <svg width="20" height="15" viewBox="0 0 14 14">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-468.000000, -254.000000)" stroke="#FFFFFF">
            <g transform="translate(260.000000, 165.000000)">
              <g transform="translate(0.000000, 75.000000)">
                <g transform="translate(19.000000, 0.000000)">
                  <g transform="translate(196.424621, 21.424621) rotate(45.000000) translate(-196.424621, -21.424621) translate(193.424621, 13.924621)">
                    <path d="M0.5,5.69098301 L0.5,2 C0.5,1.82069363 0.550664909,1.51670417 0.697213595,1.2236068 C0.927818928,0.762396132 1.32141313,0.5 2,0.5 L4,0.5 C4.67858687,0.5 5.07218107,0.762396132 5.3027864,1.2236068 C5.44933509,1.51670417 5.5,1.82069363 5.5,2 L5.5,6 C5.5,6.67858687 5.23760387,7.07218107 4.7763932,7.3027864 C4.53586606,7.42304998 4.28800365,7.47874077 4.1077327,7.49484936 L0.5,5.69098301 Z" />
                    <path
                      d="M0.5,12.690983 L0.5,9 C0.5,8.82069363 0.550664909,8.51670417 0.697213595,8.2236068 C0.927818928,7.76239613 1.32141313,7.5 2,7.5 L4,7.5 C4.67858687,7.5 5.07218107,7.76239613 5.3027864,8.2236068 C5.44933509,8.51670417 5.5,8.82069363 5.5,9 L5.5,13 C5.5,13.6785869 5.23760387,14.0721811 4.7763932,14.3027864 C4.53586606,14.42305 4.28800365,14.4787408 4.1077327,14.4948494 L0.5,12.690983 Z"
                      transform="translate(3.000000, 11.000000) scale(-1, -1) translate(-3.000000, -11.000000) "
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    ),
    icon: 'link',
    description: 'Add a link',
    page: 1,
    type: 'link',
    format: 'link',
  },
  {
    label: (
      <svg width="19px" fill="#FFFFFF" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.6 6a.59.59 0 00.6-.6c0-.346-.316-.6-.602-.6-.45 0-.91.085-1.338.219-.686.215-1.587.69-1.922 1.734-.208.651-.208 1.285-.113 1.95.043.302.085.597.085 1.028 0 .336-.267.721-.783 1.088-.494.35-1.036.553-1.228.59a.6.6 0 000 1.183c.192.036.734.239 1.228.59.516.366.783.75.783 1.087 0 .431-.042.726-.085 1.027-.095.667-.095 1.3.113 1.951.335 1.044 1.236 1.52 1.922 1.734.428.135.888.219 1.338.219.286 0 .602-.254.602-.6a.59.59 0 00-.6-.6 3.429 3.429 0 01-.98-.164c-.537-.168-.98-.46-1.14-.955-.146-.457-.141-.893-.074-1.359.045-.317.104-.729.104-1.253 0-.948-.697-1.646-1.289-2.066A5.143 5.143 0 005.912 12c.105-.063.208-.131.31-.203.591-.42 1.288-1.118 1.288-2.066 0-.524-.06-.936-.104-1.253-.067-.466-.072-.902.075-1.359.158-.494.602-.787 1.138-.955.314-.099.652-.161.982-.164zM13.8 18.6a.59.59 0 01.599-.6c.33-.003.668-.065.982-.164.536-.168.98-.46 1.138-.955.146-.457.142-.893.075-1.359-.045-.317-.104-.729-.104-1.253 0-.948.696-1.646 1.288-2.066.101-.072.205-.14.31-.203a5.176 5.176 0 01-.31-.203c-.592-.42-1.288-1.118-1.288-2.066 0-.524.06-.936.104-1.253.067-.466.071-.902-.075-1.359-.159-.494-.602-.787-1.138-.955A3.425 3.425 0 0014.399 6a.59.59 0 01-.6-.6c0-.346.317-.6.602-.6.45 0 .91.085 1.339.219.685.215 1.587.69 1.922 1.734.208.651.208 1.285.113 1.95a6.58 6.58 0 00-.085 1.028c0 .336.266.721.783 1.088.494.35 1.036.553 1.228.59a.597.597 0 01.5.591.6.6 0 01-.5.592c-.192.036-.734.239-1.228.59-.517.366-.783.75-.783 1.087 0 .431.042.726.085 1.027.095.667.095 1.3-.113 1.951-.335 1.044-1.237 1.52-1.922 1.734a4.527 4.527 0 01-1.339.219c-.285 0-.601-.254-.601-.6z" />
      </svg>
    ),
    description: 'code',
    format: 'code',
    type: 'code',
    page: 3,
  },
  {
    label: (
      <svg
        className="svg-icon"
        style={{
          width: '20px',
          height: '14px',
          verticalAlign: 'middle',
          fill: 'currentColor',
          overflow: 'hidden',
        }}
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M236.780308 1023.369846v-118.153846H864.098462v118.153846H236.780308zM313.659077 6.774154h-118.153846v472.615384a354.461538 354.461538 0 0 0 708.923077 0v-472.615384h-118.153846v472.615384a236.307692 236.307692 0 1 1-472.615385 0v-472.615384z m0 0h-118.153846v472.615384a354.461538 354.461538 0 0 0 708.923077 0v-472.615384h-118.153846v472.615384a236.307692 236.307692 0 1 1-472.615385 0v-472.615384z"
          fill="#FFFFFF"
        />
      </svg>
    ),
    description: 'underline',
    format: 'underline',
    type: 'inline',
    page: 2,
  },
  {
    label: (
      <svg
        style={{ verticalAlign: 'middle' }}
        width="20px"
        height="18px"
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="🔍-Product-Icons" stroke="none" strokeWidth="1" fill="#FFFFFF" fillRule="evenodd">
          <g id="ic_fluent_clear_formatting_24_filled" fill="#FFFFFF" fillRule="nonzero">
            <path
              d="M17.5,12 C20.5375661,12 23,14.4624339 23,17.5 C23,20.5375661 20.5375661,23 17.5,23 C14.4624339,23 12,20.5375661 12,17.5 C12,14.4624339 14.4624339,12 17.5,12 Z M3,19 L11.1741301,19.000839 C11.3444377,19.7213878 11.6346696,20.395589 12.0225923,21.0012092 L3,21 C2.44771525,21 2,20.5522847 2,20 C2,19.4871642 2.38604019,19.0644928 2.88337887,19.0067277 L3,19 Z M15.0930472,14.9662824 L15.0237993,15.0241379 L14.9659438,15.0933858 C14.8478223,15.2638954 14.8478223,15.4914871 14.9659438,15.6619968 L15.0237993,15.7312446 L16.7933527,17.5006913 L15.0263884,19.2674911 L14.968533,19.3367389 C14.8504114,19.5072486 14.8504114,19.7348403 14.968533,19.9053499 L15.0263884,19.9745978 L15.0956363,20.0324533 C15.2661459,20.1505748 15.4937377,20.1505748 15.6642473,20.0324533 L15.7334952,19.9745978 L17.5003527,18.2076913 L19.2693951,19.9768405 L19.338643,20.0346959 C19.5091526,20.1528175 19.7367444,20.1528175 19.907254,20.0346959 L19.9765019,19.9768405 L20.0343574,19.9075926 C20.1524789,19.737083 20.1524789,19.5094912 20.0343574,19.3389816 L19.9765019,19.2697337 L18.2073527,17.5006913 L19.9792686,15.7312918 L20.0371241,15.6620439 C20.1552456,15.4915343 20.1552456,15.2639425 20.0371241,15.0934329 L19.9792686,15.024185 L19.9100208,14.9663296 C19.7395111,14.848208 19.5119194,14.848208 19.3414098,14.9663296 L19.2721619,15.024185 L17.5003527,16.7936913 L15.7309061,15.0241379 L15.6616582,14.9662824 C15.5155071,14.8650354 15.3274181,14.8505715 15.1692847,14.9228908 L15.0930472,14.9662824 L15.0930472,14.9662824 Z M16.0009262,3 C16.5790869,3 17.028058,3.48583239 16.999911,4.04804907 L16.987817,4.16138954 L16.742517,5.66138954 C16.653384,6.20643427 16.1392814,6.57602377 15.5942367,6.48689078 C15.0881237,6.40412444 14.7332961,5.9549302 14.7565535,5.45478856 L14.7687354,5.33861046 L14.8241095,5 L11.432,5 L9.672,16 L10,16 C10.5128358,16 10.9355072,16.3860402 10.9932723,16.8833789 L11,17 C11,17.5128358 10.6139598,17.9355072 10.1166211,17.9932723 L10,18 L7,18 C6.44771525,18 6,17.5522847 6,17 C6,16.4871642 6.38604019,16.0644928 6.88337887,16.0067277 L7,16 L7.647,16 L9.407,5 L5.84621647,5 L5.73511131,5.66483181 C5.64407722,6.20956223 5.12868824,6.57735578 4.58395781,6.48632169 C4.0781367,6.40179003 3.72487851,5.95136054 3.74988077,5.45130308 L3.76246793,5.33516819 L4.01314447,3.83516819 C4.08698095,3.39334494 4.44361349,3.05975771 4.87894231,3.00722806 L4.99946616,3 L16.0009262,3 Z"
              id="🎨-Color"
            />
          </g>
        </g>
      </svg>
    ),
    description: 'underline',
    format: REMOVE_FORMAT,
    style: REMOVE_FORMAT,
    type: 'inline',
    page: 2,
  },
];

export const tableButtons = [
  {
    label: 'Add col',
  },
  {
    label: 'Add row',
  },
];

export default toolbarGroups;
