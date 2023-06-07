import * as express from 'express';
import * as cors from 'cors';
import {
  CreateSessionResource,
  ConnectSessionResource,
  UpdateSessionResource
} from 'endpad-model';
import { createSessionHandler } from './resource/CreateSession';
import { connectSessionHandler } from './resource/ConnectSession';
import { updateSessionHandler } from './resource/UpdateSession';

const app = express();
app.use(express.json());
app.use(cors());

app.post(CreateSessionResource, createSessionHandler);
app.post(ConnectSessionResource, connectSessionHandler);
app.post(UpdateSessionResource, updateSessionHandler);

app.listen(3000);
