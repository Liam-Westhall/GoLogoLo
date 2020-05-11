import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_LOGOS = gql`
  {
    logos {
      _id
      text
      lastUpdate
    }
  }
`;

const compareDates = (ds1, ds2) => {
    let date1 = new Date(ds1);
    let date2 = new Date(ds2);

    if(date1 < date2){
        return -1;
    } else {
        return 1;
    }
};

class HomeScreen extends Component {

    render() {
        return (
            <Query pollInterval={500} query={GET_LOGOS}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    return (
                        <div className="container row">
                            <div className="col s4">
                                <h3>Recent Work</h3>
                                {data.logos.sort((x, y) => -compareDates(x.lastUpdate, y.lastUpdate)).map((logo, index) => (
                                    <div key={index} className='home_logo_link'>
                                        <Link to={`/view/${logo._id}`} className="home_logo_link_text" style={{ cursor: "pointer" }}>{logo.text}</Link>
                                    </div>
                                ))}
                            </div>
                            <div className="col s8">
                                <div id="home_banner_container">
                                    @todo<br />
                                    List Maker
                                </div>
                                <div>
                                    <Link id="add_logo_button" to="/create" className ={"btn btn-secondary btn-block"}>Add Logo</Link>
                                </div>
                            </div>
                        </div>
                    );
                }
                }
            </Query >
        );
    }
}

export default HomeScreen;
