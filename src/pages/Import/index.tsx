import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  function handleUpload(): void {
    const data = new FormData();

    uploadedFiles.forEach((fileProp: FileProps, index: number) => {
      data.append('file', fileProp.file);
      api
        .post('/transactions/import', data)
        .then(response => {
          history.push('/');
          console.log('sucesso');
        })
        .catch(err => {
          console.log('erro');
        });
    });
  }

  function submitFile(files: File[]): void {
    const uploadFiles = files.map(
      (file: File): FileProps => ({
        file,
        name: file.name,
        readableSize: filesize(file.size),
      }),
    );

    setUploadedFiles([...uploadFiles]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
