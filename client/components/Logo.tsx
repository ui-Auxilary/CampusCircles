import Svg, { Path, Circle } from 'react-native-svg';
const Logo = (props) => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    width={'100%'}
    height={'100%'}
    fill='none'
    {...props}
  >
    <Path
      fill='#fff'
      d='M64.974 46.727c3.92 1.38 6.04 5.737 3.892 9.295a36.841 36.841 0 1 1 .852-36.586c1.98 3.654-.34 7.907-4.32 9.104-3.98 1.197-8.09-1.186-10.565-4.526a21.786 21.786 0 0 0-20.429-8.622 21.789 21.789 0 1 0 19.807 35.364c2.627-3.221 6.843-5.41 10.763-4.03Z'
    />
    <Path
      fill='#C8FF7B'
      d='M51.236 38.057c1.972.152 3.483 1.894 2.934 3.794a17.534 17.534 0 1 1-4.115-16.924c1.36 1.436.818 3.677-.865 4.718-1.682 1.04-3.865.45-5.414-.78a10.37 10.37 0 1 0 3.008 12.37c.81-1.804 2.48-3.33 4.452-3.178Z'
    />
    <Circle cx={37.129} cy={36.788} r={4.728} fill='#fff' />
  </Svg>
);
export default Logo;
