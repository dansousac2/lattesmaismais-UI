import React, { useEffect, useState } from "react";
import './CardReceipt.css';
import { Button } from "reactstrap";

import iconWaiting from '../../assets/images/Waiting.svg';
import iconChecked from '../../assets/images/Proven.svg';
import iconInvalid from '../../assets/images/Invalidated.svg';
import iconRecyclebin from '../../assets/images/recyclebinEmpty.svg';

import ReadFileService from '../../services/ReadFileService';
import AuthenticationApiService from '../../services/AuthenticationApiService'
import StorageService from "../../services/StorageService";
import { getAxcessPath } from "../../services/ServerService";


const readFileService = new ReadFileService();
const authService = new AuthenticationApiService();
const storage = new StorageService();

const createLinkToRead = async (id, extension, mescled = undefined) => {

    let getBy = id + extension;

    if(mescled) {
        getBy = mescled;
    }

    if(storage.getItem(`rec${id}`)) {
        return storage.getItem(`rec${id}`);

    } else {
        const filePathInHttpServer = await readFileService.read(getBy, authService.getLoggedUser().id)
        .then(response => {
            return getAxcessPath(response.data);
        }).catch(error => {
            alert('Falha ao carregar dados de arquivo solicitado');
            console.log(error);
        });
        
        storage.setItem(`rec${id}`, filePathInHttpServer);
        return filePathInHttpServer;
    }

}

//TODO realizar import de ícones usados ao invés de trazê-los via props
function CardReceipt(props) {

    const [receipts, setReceipts] = useState([]);

    useEffect(() => {

        const createCard = async () => {

            const receiptsToCard = await Promise.all(props.receipts.map(async rec => {

                var icon = "";

                switch (rec.status) {

                    case "WAITING_VALIDATION":
                        icon = iconWaiting;
                        break;

                    case "CHECKED_BY_VALIDATOR":
                        icon = iconChecked;
                        break;

                    case "INVALID":
                        icon = iconInvalid;
                        break;
                }

                if (rec.url == null) {

                    let readLink;
                    if(!`${rec.id}`.includes("new")) {
                        if(rec.heritage) {
                            readLink = await createLinkToRead("","", rec.heritage);
                        } else {
                            readLink = await createLinkToRead(rec.id, rec.extension);
                        }
                    }

                    return (
                        <div key={`recUni${rec.id}`} className="Receipt-unique">
                            <img className="Icons Icon-Entry" border="0" src={icon} />
                            {/* "rel" é usado como uma medida de segurança para evitar ataques de phishing. */}
                            <a href={readLink} target="_blank" rel="noopener noreferrer"> {rec.name} </a>
                            <b id={`extRec${rec.id}`}> {rec.extension} </b>
                            <b id={`commRec${rec.id}`}> {(rec.commentary === "") ? "---" : `"${rec.commentary}"`} </b>
                            <Button id={`btRec${rec.id}`} onClick={() => { props.deleteMethod(rec.id, true) }} color="danger" size="sm" >
                                <img className="Icons Icon-Entry" src={iconRecyclebin} />
                            </Button>
                        </div>
                    )
                } else {
                    return (
                        <div key={`recUni${rec.id}`} className="Receipt-unique">
                            <img className="Icons Icon-Entry" border="0" src={icon} />
                            <b id={`commRec${rec.id}`}> {rec.commentary === null ? "---" : rec.commentary} </b>
                            <a href={rec.url} target="_blank"> Link para comprovação eletrônica </a>
                            <Button id={`btRec${rec.id}`} onClick={() => { props.deleteMethod(rec.id, false) }} color="danger" size="sm" >
                                <img className="Icons Icon-Entry" src={iconRecyclebin} />
                            </Button>
                        </div>
                    )
                }
            }));

            setReceipts(receiptsToCard);
        };

        createCard();

        // atualiza sempre que alterações forem feitas na lista de receipts passadas como propriedade
    }, [props.receipts, props.update]);


    return (
        <div className="Receipts-of-current-entry">
            {receipts}
        </div>
    )

}
export default CardReceipt;