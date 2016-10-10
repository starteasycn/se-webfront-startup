import React, {Component} from 'react'
import {bindActionCreators, Link} from 'redux'
import {connect} from 'react-redux'

import HomeWelcome from '../../components/HomeWelcome'
import { getMenuData } from '../../reducers/login'
import {fetchMenuData} from '../../services'
import { HomeHeader } from '../../components/HomeHeader'

import {md5} from '../../tools'

class App extends Component {
    
    constructor(props, context) {
        super(props, context)
    }

    render() {
        var { menuData, dispatch} = this.props;
        
        return (
            <HomeWelcome/>
        )
    }
}

function mapStateToProps(state) {
    return {
        menuData: getMenuData(state)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch),
        dispatch: dispatch
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

