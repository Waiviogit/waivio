import React from 'react';
import { HYPERLINK } from '../util/constants';
import './toolbar.less';

export const BLOCK_BUTTONS = [
  {
    label: 'H1',
    style: 'header-one',
    icon: 'header',
    description: 'Heading 1',
    page: 1,
  },
  {
    label: 'H2',
    style: 'header-two',
    icon: 'header',
    description: 'Heading 2',
    page: 1,
  },
  {
    label: 'H3',
    style: 'header-three',
    icon: 'header',
    description: 'Heading 3',
    page: 2,
  },
  {
    label: 'H4',
    style: 'header-four',
    icon: 'header',
    description: 'Heading 4',
    page: 2,
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
    style: 'blockquote',
    description: 'Blockquote',
  },
];

export const INLINE_BUTTONS = [
  {
    label: 'B',
    style: 'BOLD',
    icon: 'bold',
    description: 'Bold',
    page: 1,
  },
  {
    label: 'I',
    style: 'ITALIC',
    icon: 'italic',
    description: 'Italic',
    page: 1,
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
    style: HYPERLINK,
    icon: 'link',
    description: 'Add a link',
    page: 1,
  },
];

export const CODE_BUTTONS = [
  {
    label: (
      <svg width="19px" fill="#FFFFFF" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.6 6a.59.59 0 00.6-.6c0-.346-.316-.6-.602-.6-.45 0-.91.085-1.338.219-.686.215-1.587.69-1.922 1.734-.208.651-.208 1.285-.113 1.95.043.302.085.597.085 1.028 0 .336-.267.721-.783 1.088-.494.35-1.036.553-1.228.59a.6.6 0 000 1.183c.192.036.734.239 1.228.59.516.366.783.75.783 1.087 0 .431-.042.726-.085 1.027-.095.667-.095 1.3.113 1.951.335 1.044 1.236 1.52 1.922 1.734.428.135.888.219 1.338.219.286 0 .602-.254.602-.6a.59.59 0 00-.6-.6 3.429 3.429 0 01-.98-.164c-.537-.168-.98-.46-1.14-.955-.146-.457-.141-.893-.074-1.359.045-.317.104-.729.104-1.253 0-.948-.697-1.646-1.289-2.066A5.143 5.143 0 005.912 12c.105-.063.208-.131.31-.203.591-.42 1.288-1.118 1.288-2.066 0-.524-.06-.936-.104-1.253-.067-.466-.072-.902.075-1.359.158-.494.602-.787 1.138-.955.314-.099.652-.161.982-.164zM13.8 18.6a.59.59 0 01.599-.6c.33-.003.668-.065.982-.164.536-.168.98-.46 1.138-.955.146-.457.142-.893.075-1.359-.045-.317-.104-.729-.104-1.253 0-.948.696-1.646 1.288-2.066.101-.072.205-.14.31-.203a5.176 5.176 0 01-.31-.203c-.592-.42-1.288-1.118-1.288-2.066 0-.524.06-.936.104-1.253.067-.466.071-.902-.075-1.359-.159-.494-.602-.787-1.138-.955A3.425 3.425 0 0014.399 6a.59.59 0 01-.6-.6c0-.346.317-.6.602-.6.45 0 .91.085 1.339.219.685.215 1.587.69 1.922 1.734.208.651.208 1.285.113 1.95a6.58 6.58 0 00-.085 1.028c0 .336.266.721.783 1.088.494.35 1.036.553 1.228.59a.597.597 0 01.5.591.6.6 0 01-.5.592c-.192.036-.734.239-1.228.59-.517.366-.783.75-.783 1.087 0 .431.042.726.085 1.027.095.667.095 1.3-.113 1.951-.335 1.044-1.237 1.52-1.922 1.734a4.527 4.527 0 01-1.339.219c-.285 0-.601-.254-.601-.6z" />
      </svg>
    ),
    style: 'code-block',
    description: 'code',
  },
];
