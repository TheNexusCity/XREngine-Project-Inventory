import { addV1Routes } from './v1/index.js'
import createDeployer from "./deployer";
import { Application } from '../../../../../server-core/declarations.js';

export default (app: Application): any => {
createDeployer(3033);
addV1Routes(app);
}
