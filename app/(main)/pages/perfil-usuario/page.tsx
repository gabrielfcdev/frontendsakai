/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Projeto } from '../../../../types/types';
import { PerfilUsuarioService } from '../../../../service/PerfilUsuarioService';
import { userAgent } from 'next/server';
import { UsuarioService } from '../../../../service/UsuarioService';
import { PerfilService } from '../../../../service/PerfilService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

const PerfilUsuario = () => {
    let perfilUsuarioVazio: Projeto.PerfilUsuario = {
        id: 0,
        perfil: {descricao: ''},
        usuario: {nome: '', login: '', senha: '', email: ''}
    };


    const [perfisUsuario, setPerfilsUsuario] = useState<Projeto.PerfilUsuario[] | null>(null);
    const [perfilUsuarioDialog, setPerfilUsuarioDialog] = useState(false);
    const [deletePerfilUsuarioDialog, setDeletePerfilUsuarioDialog] = useState(false);
    const [deletePerfilsUsuarioDialog, setDeletePerfilsUsuarioDialog] = useState(false);
    const [perfilUsuario, setPerfilUsuario] = useState<Projeto.PerfilUsuario>(perfilUsuarioVazio);
    const [selectedPerfilsUsuario, setSelectedPerfilsUsuario] = useState<Projeto.PerfilUsuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilUsuarioService = useMemo(() => new PerfilUsuarioService(), []);
    const usuarioService = useMemo(() => new UsuarioService(), []);
    const perfilService = useMemo(() => new PerfilService(), []);
    const [usuarios, setUsuarios] = useState<Projeto.Usuario[]>([]);
    const [perfis, setPerfis] = useState<Projeto.Perfil[] >([]);


    useEffect(() => {
        if (!perfisUsuario) {
            perfilUsuarioService.listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setPerfilsUsuario(response.data);
                }).catch((error) => {
                    console.log(error);
                })
        }
    }, [perfilUsuarioService, perfisUsuario]);

    useEffect(() =>{
        if(perfilUsuarioDialog){
            usuarioService.listarTodos()
            .then((response) => setUsuarios(response.data))
            .catch(error => {
                console.log(error);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Erro!',
                    detail: 'Erro ao carregar a lista de usuário!'
                });
            });
            perfilService.listarTodos()
            .then((response) => setPerfis(response.data))
            .catch(error => {
                console.log(error);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Erro!',
                    detail: 'Erro ao carregar a lista de perfil!'
                });
            });
        }
    }, [perfilUsuarioDialog, perfilService, usuarioService]);

    useEffect(() => {
        if(perfilUsuarioDialog){
            perfilUsuarioService.listarTodos()
            .then((response) => setPerfilUsuario(response.data))
            .catch(error => {
                console.log(error);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Erro!',
                    detail: 'Erro ao carregar a lista de usuário!'
                });
            });
            perfilUsuarioService.listarTodos()
            .then((response) => setPerfilsUsuario(response.data))
            .catch(error => {
                console.log(error);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Erro!',
                    detail: 'Erro ao carregar a lista de perfil!'
                });
            });
        }
    }, [perfilUsuarioDialog, perfilUsuarioService, usuarioService]);


    const openNew = () => {
        setPerfilUsuario(perfilUsuarioVazio);
        setSubmitted(false);
        setPerfilUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilUsuarioDialog(false);
    };

    const hideDeletePerfilDialog = () => {
        setDeletePerfilUsuarioDialog(false);
    };

    const hideDeletePerfilsDialog = () => {
        setDeletePerfilsUsuarioDialog(false);
    };

    const savePerfil = () => {
        setSubmitted(true);

        if (!perfilUsuario.id) {
            perfilUsuarioService.inserir(perfilUsuario)
            .then((response) => {
                setPerfilUsuarioDialog(false);
                setPerfilUsuario(perfilUsuarioVazio);
                setPerfilsUsuario(null);
                toast.current?.show({
                    severity:'info',
                    summary: 'Sucesso!',
                    detail: 'Perfil Usúario Cadastrado com sucesso!'

                });
            }).catch((error) => {
                console.log(error.data.message);
                toast.current?.show({
                    severity:'error',
                    summary: 'Erro!',
                    detail: 'Erro ao salvar!' + error.data.message

                })
            });

        } else {
            perfilUsuarioService.alterar(perfilUsuario)
           .then((response) => {
            setPerfilUsuarioDialog(false);
            setPerfilUsuario(perfilUsuarioVazio);
            setPerfilsUsuario(null);
            toast.current?.show({
                severity:'info',
                summary: 'Sucesso!',
                detail: 'Perfil usúario alterado com sucesso!'
            });
           }).catch((error) => {
            console.log(error.data.message);
            toast.current?.show({
                severity:'error',
                summary: 'Erro!',
                detail: 'Erro ao alterar!' + error.data.message

            })
        })

        }
    };

    const editPerfil = (perfilUsuario: Projeto.PerfilUsuario) => {
        setPerfilUsuario({ ...perfilUsuario });
        setPerfilUsuarioDialog(true);
    };

    const confirmDeletePerfilUsuario = (perfilUsuario: Projeto.PerfilUsuario) => {
        setPerfilUsuario(perfilUsuario);
        setDeletePerfilUsuarioDialog(true);
    };

    const deletePerfilUsuario = () => {
      if (perfilUsuario.id) {
            perfilUsuarioService.excluir(perfilUsuario.id).then((response) => {
                setPerfilUsuario(perfilUsuarioVazio);
                setDeletePerfilUsuarioDialog(false);
                setPerfilsUsuario(null);
                toast.current?.show({
                    severity:'success',
                    summary: 'Sucesso!',
                    detail: 'Perfil usúario excluído com sucesso!',
                    life: 3000
                });
            }).catch((error) => {
                toast.current?.show({
                    severity:'error',
                    summary: 'Erro!',
                    detail: 'Erro ao excluir!',
                    life: 3000
                });
            });

        }
    };



    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePerfilsUsuarioDialog(true);
    };

    const deleteSelectedPerfilsUsuario = () => {

        Promise.all(selectedPerfilsUsuario.map((_perfilUsuario) => {
            if (_perfilUsuario.id) {
                perfilUsuarioService.excluir(_perfilUsuario.id)
                    .then((response) => {

                    }).catch((error) => {

                    });
            }
        })).then((response) => {
            setPerfilsUsuario(null);
            setSelectedPerfilsUsuario([]);
            setDeletePerfilsUsuarioDialog(false);
            toast.current?.show({
                severity:'success',
                summary: 'Sucesso!',
                detail: 'perfils usuarios excluídos com sucesso!',
                life: 3000
            });

        }).catch((error) => {
            toast.current?.show({
                severity:'error',
                summary: 'Erro!',
                detail: 'Erro ao excluir Perfils Usuario!',
                life: 3000
            });
        })

    };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setPerfilUsuario(prevPerfilUsuario => ({
            ...prevPerfilUsuario,
            [name]: val,

        }));
    };



    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfilsUsuario || !(selectedPerfilsUsuario as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">descricao</span>
                {rowData.perfil.descricao}
            </>
        );
    };
    const usuarioBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">usuario</span>
                {rowData.usuario.usuario}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfil(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfilUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Perfils usuario</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const PerfilUsuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePerfil} />
        </>
    );
    const deletePerfilUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfilUsuario} />
        </>
    );
    const deletePerfilsUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilsDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPerfilsUsuario} />
        </>
    );
    const onSelectPerfilChange = (perfil: Projeto.Perfil) => {
        let _perfilUsuario = {...perfilUsuario};
        _perfilUsuario.perfil = perfil;
        setPerfilUsuario(_perfilUsuario);
    }
    const onSelectUsuarioChange = (usuario: Projeto.Usuario) => {
        let _perfilUsuario = {...perfilUsuario};
        _perfilUsuario.usuario = usuario;
        setPerfilUsuario(_perfilUsuario);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={perfisUsuario}
                        selection={selectedPerfilsUsuario}
                        onSelectionChange={(e) => setSelectedPerfilsUsuario(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} Perfils"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum Perfil encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="usuario" header="Usuário" sortable body={usuarioBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>


                    </DataTable>

                    <Dialog visible={perfilUsuarioDialog} style={{ width: '450px' }} header="Detalhes do Perfil" modal className="p-fluid" footer={PerfilUsuarioDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown optionLabel='descricao' value={perfilUsuario.perfil} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder='Selecione um perfil...'></Dropdown>

                            {submitted && !perfilUsuario.perfil && <small className="p-invalid">Perfil é obrigatório.</small>}
                        </div>+
                        <div className="field">
                            <label htmlFor="usuario">Usuário</label>
                            <Dropdown optionLabel='nome' value={perfilUsuario.usuario} options={usuarios} filter onChange={(e: DropdownChangeEvent) => onSelectUsuarioChange(e.value)} placeholder='Selecione um usuario...'></Dropdown>


                            {submitted && !perfilUsuario.usuario && <small className="p-invalid">Usuario é obrigatório.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deletePerfilUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilUsuarioDialogFooter} onHide={hideDeletePerfilDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && (
                                <span>
                                    Você realmente deseja excluir o Perfil? <b>{perfilUsuario.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilsUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilsUsuarioDialogFooter} onHide={hideDeletePerfilsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && <span>Você realmente deseja excluir os Perfis selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PerfilUsuario;
