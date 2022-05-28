import React, { useCallback, useEffect, useState } from "react";
import { withRouter } from 'react-router';
import { useHistory } from "react-router-dom";

const FormsList = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    let history = useHistory();

    function fetchData() {
        setLoading(true);

        fetch(`feedback`,
                {
                    method: "get"
                })
            .then((response) => response.json())
            .then((responseJson) => {
                setLoading(false);
                setItems(responseJson);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    function handleSelect(item) {
        history.push(`/forms/${item.id}`);
    };

    const handleCreateItem = useCallback(() => {
        history.push("/forms/new");
    });

    const renderTable = (items) => {
        return (
            <div>
                <button onClick={handleCreateItem}>Create</button>
                <table className='table table-striped' aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item =>
                            <tr key={item.id} onClick={() => handleSelect(item)} >
                                <td>{item.id}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    let contents = '';

    if (loading) {
        contents = (<div className="spinner-border" role="status"><span className="sr-only"></span></div>);
    } else if (items) {
        contents = renderTable(items);
    }

    return (
        <div>
            <h1 id="tableLabel">Forms</h1>
            {contents}
        </div>
    );
}

export default withRouter(FormsList);