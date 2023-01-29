import { CommonUtil } from "../util/CommonUtil";

CommonUtil.getImageHash(`${__dirname}/test.jpg`)
  .then(console.log)
  .catch(console.error);
