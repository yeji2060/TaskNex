import React, { useState } from 'react';
import 'react-responsive-modal/styles.css';
import './BarReport.css';
import { Modal } from 'react-responsive-modal';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const loginUrl = "https://tasknexauth.onrender.com/api/auth/login";
const getUserData = "https://tasknexauth.onrender.com/api/auth/userinfo";
const postAdminUsers = "https://tasknexauth.onrender.com/api/auth/register";

const Adlogin = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fname, setfname] = useState('');
    const [lname, setlname] = useState('');
    const [department, setdepartment] = useState('');
    const [role, setrole] = useState('');
    const [message, setMessage] = useState('');
    const [login, setLogin] = useState(true);
    const [registerfirst, setRegisterfirst] = useState(false);
    const [userphone, setUserphone] = useState('');
    const [useremailAD, setUseremailAD] = useState('');
    const [userpassword, setUserpassword] = useState('');
    const history = useHistory();
    

    const loginNow = async () => {
        try {
            const msg = {
                password,
                email,
                message
            };
            const res = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(msg)
            });

            const data = await res.json();
            if (data.auth === false) {
                setMessage(data.token);
                alert(data.token);
            } else {
                localStorage.setItem('rtk', data.token);
                setTimeout(async () => {
                    const res = await fetch(getUserData, {
                        method: 'GET',
                        headers: {
                            'x-access-token': localStorage.getItem('rtk')
                        }
                    });
                    const data = await res.json();
                    localStorage.setItem('userdata', data.name);
                    localStorage.setItem('userRole', data.role);
                    setrole(data.role);
                    if (data.role === 'Admin') {
                        history.push('/');
                    } else if(data.role === 'User') {
                        history.push('/task/:id');
                    }
                }, 1000);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const registerNow = async () => {
        try {
            const Reg = {
                userId: uuidv4(),
                fname:fname,
                lname:lname,
                email:email,
                password:password,
                phone:phone,
                department:department,
                role:role
            };

            await fetch(postAdminUsers, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(Reg)
            });

            setLogin(true);
            setRegisterfirst(false);
        } catch (e) {
            console.log(e);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'fname':
                setfname(value);
                break;
            case 'lname':
                setlname(value);
                break;
            case 'userole':
                setrole(value);
              break;
            case 'userphone':
                setUserphone(value);
                break;
            case 'useremailAD':
                setUseremailAD(value);
                break;
            case 'department':
                setdepartment(value);
                break;
            case 'userpassword':
                setUserpassword(value);
                break;
            default:
                break;
        }
    };

    const onCloseModallogin = () => {
        setLogin(false);
        setRegisterfirst(true);
    };

    const closePage = () => {
        setRegisterfirst(false);
        setLogin(true);
    };

    return (
        <>
            <Modal open={login} center>
                <div>
                    <div className="formdesign152">
                        <h6 className="mb-3">Login First</h6>
                        <div>
                            <center>
                                <input autoComplete="off" className="form-control mb-3 formsize51" name="email" require placeholder="Input Email" value={email} onChange={handleChange} />
                                <input type="password" autoComplete="off" className="form-control mb-3 formsize51" name="password" require placeholder="Enter Password" value={password} onChange={handleChange} />
                                <button disabled={email === ''} className="btn btn-warning formsize91" onClick={loginNow}>Login</button>
                                <button disabled={email !== ''} className="btn btn-warning formsize91" onClick={onCloseModallogin}>Register</button>
                            </center>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={registerfirst} onClose={closePage} center>
                <div>
                    <div className="formdesign152">
                        <h6 className="mb-3">Register First</h6>
                        <div>
                            <input autoComplete="off" className="form-control mb-3 formsize51" name="fname" require placeholder="Enter First Name" value={fname} onChange={handleChange} />
                            <input autoComplete="off" className="form-control mb-3 formsize51" name="lname" require placeholder="Enter Last Name" value={lname} onChange={handleChange} />
                            <input autoComplete="off" className="form-control mb-3 formsize51" name="userphone" require placeholder="Enter Phone" value={userphone} onChange={handleChange} />
                            <input autoComplete="off" className="form-control mb-3 formsize51" name="department" require placeholder="Enter Phone" value={department} onChange={handleChange} />
                            <input autoComplete="off" className="form-control mb-3 formsize51" name="useremailAD" require placeholder="Enter Email" value={useremailAD} onChange={handleChange} />
                            <input autoComplete="off" className="form-control mb-3 formsize51" name="userole" require placeholder="Enter Role" value={role} onChange={handleChange} />
                            <input type="password" autoComplete="off" className="form-control mb-3 formsize51" name="userpassword" require placeholder="Enter Password" value={userpassword} onChange={handleChange} />
                            <button disabled={useremailAD === '' || username === ''} className="btn btn-warning formsize91" onClick={registerNow}>Register</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Adlogin;
