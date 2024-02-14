/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // webpackDevMiddleware: (config) => {
  //   config.watchOptions = {
  //     poll: 1000,
  //     aggregateTimeout: 300,
  //   };
  //   return config;
  // },
  // sassOptions:{
  //   includePaths: [path.join(__dirname, "styles")],
  // },
  compress: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./src/loader/image.js",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]

  },
};

module.exports = nextConfig;


// domains: [
//   "res.cloudinary.com",
//   "dummyimage.com",
//   "order.genkisushi.com.hk",
//   "www.eatingwell.com",
//   "435942178851awssenryopublics3d01.s3.ap-east-1.amazonaws.com",
//   "674245802421awssenryopublics3u01.s3.ap-east-1.amazonaws.com",
//   "genkid365prod.blob.core.windows.net",
//   "553085098556awssenryopublics3s01.s3.ap-east-1.amazonaws.com",
//   "senryod365uat.blob.core.windows.net"
// ],