import React, { useState, useEffect } from 'react';
import Publication from './Publication';
import axios from 'axios';

export default function EmployeeList() {
    //
    const [publicationList, setPublicationList] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState(null);

    useEffect(() => {
        refreshPublicationList();
    }, [])

    const publicationCrudAPI = (url = 'http://localhost:50686/api/Publications/') => {
        return {
            getAll: () => axios.get(url),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updateRecord) => axios.put(url + id, updateRecord),
            delete: id => axios.delete(url + id)
        }
    }

    function refreshPublicationList() {
        publicationCrudAPI().getAll()
            .then(response => {
                setPublicationList(response.data);
            })
            .catch(error => console.log(error));
    }

    const opAddOrEdit = (formData, onSuccess) => {
        if (formData.get('publicationId') === '0') {
            publicationCrudAPI().create(formData)
                .then(response => {
                    onSuccess();
                    refreshPublicationList();
                })
                .catch(error => console.log(error));
        } else {
            publicationCrudAPI().update(formData.get('publicationId'), formData)
                .then(response => {
                    onSuccess();
                    refreshPublicationList();
                })
                .catch(error => console.log(error));
        }
    };

    const showPublicationDeatils = data => {
        setRecordForEdit(data);
    };

    const onDelete = (event, id) => {
        event.stopPropagation();
        if (window.confirm('Вы подтверждаете удаление публикации?')) {
            publicationCrudAPI().delete(id)
                .then(response => refreshPublicationList())
                .catch(error => console.log(error));
        }
    };

    const renderImageCard = data => (
        <div className="card" onClick={() => { showPublicationDeatils(data); openAddOrEdit();}}>
            <img src={data.imageSrc} className="card-img mini" alt="..." />
            <div className="card-body">
                <button className="btn btn-light delete-button" style={{ margin: "-75px 0 10px 0", opacity: "0.75"}}
                    onClick={event => onDelete(event, parseInt(data.publicationId))}>
                    Delete
                </button>
            </div>
        </div>
    );
    const openAddOrEdit = () => {
        document.getElementById("publication").style.display = "inline";
        document.getElementById("publicationCreationCall").style.display = "none";
        window.scrollTo({ top: 0, behavior: `smooth` })
    };

    const caption_style = {
        color: "#40394a",
        fontFamily: "Segoe UI",
        fontWeight: "600",
        fontSize: "34pt",
        marginTop: "10px",
        marginBottom: "20px"
    };

    const jumbotron_style = {
        background: "#f9f7f7",
        border: "1px solid lightgray",
        borderRadius: "15px",
        boxShadow: "0 0 silver, 0 0 40px #dbe2ef",
        marginRight: "20px",
        marginTop: "15px",
        padding: "20px"
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="jumbotron jumbotro-fluid py-4" style={jumbotron_style}>
                    <div className="container text-center">

                        <h1 className="display-4" style={caption_style}>Publication</h1>
                        <div id="publicationCreationCall">
                            <div className="form-group text-center">
                                <button className="btn btn-success" onClick={openAddOrEdit }>Add New Publication</button>
                            </div>
                        </div>
                        <div id="publication" className="col-md-12" style={{ display: "none" }}>
                            <Publication opAddOrEdit={opAddOrEdit} recordForEdit={recordForEdit} />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="col-md-12">
                <table>
                    <tbody>
                        {
                            [...Array(Math.ceil(publicationList.length / 3))].map((emp, i) => (
                                <tr key={i}>
                                    <td>{renderImageCard(publicationList[3 * i])}</td>
                                    <td>
                                        {publicationList[3 * i + 1] ? renderImageCard(publicationList[3 * i + 1]) : null}
                                    </td>
                                    <td>{publicationList[3 * i + 2] ? renderImageCard(publicationList[3 * i + 2]) : null}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}