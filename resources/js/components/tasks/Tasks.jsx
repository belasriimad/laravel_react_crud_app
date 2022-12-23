import axios from 'axios';
import React, { useEffect, useState } from 'react'
import useCategories from '../../custom/useCategories';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { useDebounce } from 'use-debounce';


export default function Posts() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [catId, setCatId] = useState(null);
    const [orderBy, setOrderBy] = useState(null);
    const [searchTerm , setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        if(!categories.length){
            fetchCategories();
        }
        if(!tasks.length){
            fetchTasks();
        }
    }, [page, catId, orderBy, debouncedSearchTerm[0]])


    const fetchTasks = async () => {
        let response = null;
        try {
            if(catId) {
                response = await axios.get(`/api/category/${catId}/tasks?page=${page}`);
            }else if(orderBy) {
                response = await axios.get(`api/order/${orderBy.column}/${orderBy.direction}/tasks?page=${page}`);
            }else if(debouncedSearchTerm[0] !== ''){
                response = await axios.get(`api/search/${searchTerm}/tasks?page=${page}`);
            }else{
                response = await axios.get(`/api/tasks?page=${page}`);
            }
            setTasks(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        const fetchedCategories = await useCategories();
        setCategories(fetchedCategories);
    }

    const checkIfTaskIsDone = (done) => (
        done ? 
            (
                <span className='badge bg-success'>
                    Done
                </span>
            )
            :
            (
                <span className='badge bg-danger'>
                    Processing...
                </span>
            )
    )

    const fetchNextPrevTasks = (link) => {
        const url = new URL(link);
        setPage(url.searchParams.get('page'));
    }

    const deleteTask = (taskId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const respone = await axios.delete(`/api/tasks/${taskId}`);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: respone.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    fetchTasks();
                } catch (error) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Something went wrong try later',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        });
    }

    const renderPaginationLinks = () => {
        return <ul className="pagination">
            {
                tasks.links?.map((link,index) => (
                    <li key={index} className="page-item">
                        <a style={{cursor: 'pointer'}} className={`page-link ${link.active ? 'active' : ''}`} 
                            onClick={() => fetchNextPrevTasks(link.url)}>
                            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                        </a>
                    </li>
                ))
            }
        </ul>
    }

    return (
        <div className="row my-5">
            <div className="col-md-9 card">
                <div className="row my-3">
                    <div className="col-md-4">
                        <div className="form-group">
                            <input type="text" 
                                value={searchTerm}
                                onChange={(e) => {
                                    setCatId(null);
                                    setOrderBy(null);
                                    setPage(1);
                                    setSearchTerm(e.target.value);
                                }}
                                placeholder="Search..." 
                                className="form-control rounded-0 border border-dark" />
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Body</th>
                                <th>Done</th>
                                <th>Category</th>
                                <th>Created</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tasks.data?.map(task => (
                                    <tr key={task.id}>
                                        <td>{task.id}</td>
                                        <td>{task.title}</td>
                                        <td>{task.body}</td>
                                        <td>
                                            {
                                                checkIfTaskIsDone(task.done)
                                            }
                                        </td>
                                        <td>{task.category.name}</td>
                                        <td>{task.created_at}</td>
                                        <td className="d-flex">
                                            <Link to={`edit/${task.id}`} className="btn btn-sm btn-warning"><i className="fas fa-edit"></i></Link>
                                            <button onClick={() => deleteTask(task.id)} className="btn btn-sm btn-danger mx-1"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="my-4 d-flex justify-content-between">
                        <div>
                            Showing {tasks.from || 0} to {tasks.to || 0} from {tasks.total} results.
                        </div>
                        <div>
                            {renderPaginationLinks()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card">
                    <div className="card-header text-center bg-white">
                        <h5 className="mt-2">Filter by category</h5>
                    </div>
                    <div className="card-body">
                        <div className="form-check">
                            <input name="category" className="form-check-input" 
                                onChange={() => {
                                    setOrderBy(null);
                                    setCatId(null);
                                    setSearchTerm('');
                                    setPage(1);
                                    fetchTasks();
                                }}
                                type="radio" checked={!catId ? true : false}/>
                            <label className="form-check-label" htmlFor="category">
                                All
                            </label>
                        </div>
                        {
                            categories?.map(category => (
                                <div className="form-check" key={category.id}>
                                    <input name="category" className="form-check-input" 
                                        onChange={(event) => {
                                            setOrderBy(null);
                                            setSearchTerm('');
                                            setPage(1);
                                            setCatId(event.target.value);
                                        }}
                                        type="radio" value={category.id} id={category.id} />
                                    <label className="form-check-label" htmlFor={category.id}>
                                        {category.name}
                                    </label>
                                </div>
                              
                            ))
                        }
                    </div>
                </div>
                <div className="card mt-2">
                    <div className="card-header text-center bg-white">
                        <h5 className="mt-2">Order by</h5>
                    </div>
                    <div className="card-body">
                        <div>
                            <h6>ID</h6>
                            <div className="form-check">
                                <input name="id" className="form-check-input" 
                                    onChange={(event) => {
                                        setCatId(null);
                                        setSearchTerm('');
                                        setPage(1);
                                        setOrderBy({
                                            column: 'id',
                                            direction: event.target.value
                                        });
                                    }}
                                    type="radio" value="asc" 
                                    checked={orderBy && orderBy.column === 'id' && orderBy.direction === 'asc' ? true : false}/>
                                <label className="form-check-label" htmlFor="id">
                                    <i className="fas fa-arrow-up"></i>
                                </label>
                            </div>
                            <div className="form-check">
                                <input name="id" className="form-check-input" 
                                    onChange={(event) => {
                                        setCatId(null);
                                        setSearchTerm('');
                                        setPage(1);
                                        setOrderBy({
                                            column: 'id',
                                            direction: event.target.value
                                        });
                                    }}
                                    type="radio" value="desc"
                                    checked={orderBy && orderBy.column === 'id' && orderBy.direction === 'desc' ? true : false}/>
                                <label className="form-check-label" htmlFor="id">
                                    <i className="fas fa-arrow-down"></i>
                                </label>
                            </div>
                        </div>
                        <div className="my-3">
                            <h6>Title</h6>
                            <div className="form-check">
                                <input name="title" className="form-check-input" 
                                    onChange={(event) => {
                                        setCatId(null);
                                        setSearchTerm('');
                                        setPage(1);
                                        setOrderBy({
                                            column: 'title',
                                            direction: event.target.value
                                        });
                                    }}
                                    type="radio" value="asc"
                                    checked={orderBy && orderBy.column === 'title' && orderBy.direction === 'asc' ? true : false}/>
                                <label className="form-check-label" htmlFor="title">
                                    <i className="fas fa-arrow-up"></i>
                                    <span className="mx-2">A-Z</span>
                                </label>
                            </div>
                            <div className="form-check">
                                <input name="title" className="form-check-input" 
                                    onChange={(event) => {
                                        setCatId(null);
                                        setSearchTerm('');
                                        setPage(1);
                                        setOrderBy({
                                            column: 'title',
                                            direction: event.target.value
                                        });
                                    }}
                                    type="radio" value="desc"
                                    checked={orderBy && orderBy.column === 'title' && orderBy.direction === 'desc' ? true : false}/>
                                <label className="form-check-label" htmlFor="title">
                                    <i className="fas fa-arrow-down"></i>
                                    <span className="mx-2">Z-A</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
