import axios, { AxiosResponse } from 'axios';
import { BaseService } from "./BaseService";
export class UsuarioService extends BaseService {
    constructor(){
        super("/usuario");
    }
}
