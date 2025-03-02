import { DataSource, DataSourceOptions } from 'typeorm';

import typeOrmConfig from './typeorm.config';

const dataSource = new DataSource(typeOrmConfig as DataSourceOptions);

export default dataSource;
