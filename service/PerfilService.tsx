import axios, { AxiosResponse } from 'axios';
import { BaseService } from "./BaseService";

export class PerfilService extends BaseService{
    constructor(){
        super("/perfil");
    }
}
