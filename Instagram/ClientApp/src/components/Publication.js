import React, { useState, useEffect } from 'react';

const defaultImageSrc = '/img/default.png';

const initialFieldValues = {
    publicationId: 0,
    publicationName: '',
    publicationDescription: '',
    publicationAuthor: '',
    publicationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
    imageName: '',
    imageFile: null,
    imageSrc: defaultImageSrc
};

export default function Publication(props) {
    //
    const { opAddOrEdit, recordForEdit } = props;
    const [values, setValues] = useState(initialFieldValues);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (recordForEdit != null) {
            setValues(recordForEdit);
        }
    }, [recordForEdit]);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value
        });
    }

    const showPreview = event => {
        if (event.target.files && event.target.files[0]) {
            let imageFile = event.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target.result
                });
            };
            reader.readAsDataURL(imageFile);
        } else {
            setValues({
                ...values,
                imageFile: null,
                imageSrc: defaultImageSrc
            });
        }
    };

    const validate = () => {
        let temp = {};
        temp.publicationName = values.publicationName === '' ? false : true;
        temp.imageSrc = values.imageSrc === defaultImageSrc ? false : true;
        setErrors(temp);
        return Object.values(temp).every(x => x === true);
    };

    const resetForm = () => {
        setValues(initialFieldValues);
        document.getElementById('image-uploader').value = null;
        setErrors({});
    };

    const handleFormSubmit = event => {
        event.preventDefault();
        if (validate()) {
            const formData = new FormData();
            formData.append('publicationId', values.publicationId);
            formData.append('publicationName', values.publicationName);
            formData.append('publicationDescription', values.publicationDescription);
            formData.append('publicationAuthor', values.publicationAuthor);
            formData.append('publicationDate', values.publicationDate);
            formData.append('imageName', values.imageName);
            formData.append('imageFile', values.imageFile);
            opAddOrEdit(formData, resetForm);
        }
    };

    const applyErrorClass = field => {
        return (field in errors && errors[field] === false) ? ' invalid-field' : ''
    }
    const divStyle = {
        marginTop: "15px",
        textAlign: "left"
    };

    const closeAddOrEdit = () => {
        document.getElementById("publication").style.display = "none";
        document.getElementById("publicationCreationCall").style.display = "inline";
    };
    return (
        <React.Fragment>
            <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <div className="">
                            <img src={values.imageSrc} className="card-img" alt="..." />
                        </div>
                        
                        <div className="custom-file" style={divStyle}>
                            <input type="file" accept="image/*" className={'custom-file-input' + applyErrorClass('imageSrc')} id="image-uploader" required onChange={showPreview} />
                            <label className="custom-file-label" value={values.imageName}>Choose file...</label>
                        </div>
                    </div>
                    <div className="col-md-8 card-body">

                        
                        <div className="form-group">
                            <input className={'form-control' + applyErrorClass('publicationName')}
                                placeholder="Publication Name" name="publicationName"
                                value={values.publicationName} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <textarea rows="8" className='form-control' placeholder="Description"
                                name="publicationDescription" value={values.publicationDescription}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <input className='form-control' placeholder="Author"
                                name="publicationAuthor" value={values.publicationAuthor}
                                onChange={handleInputChange} />
                        </div>
                        <div className="row">
                            <div className="col-md-9"></div>
                            <div className="form-group text-center col-md-1">
                                <button type="submit" className="btn btn-success">Add</button>
                            </div>
                            <div className="form-group text-center col-md-2">
                                <button className="btn btn-danger" onClick={closeAddOrEdit }>Close</button>
                                </div>
                        </div>
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
}