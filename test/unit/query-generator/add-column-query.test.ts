import { DataTypes } from '@sequelize/core';
import { buildInvalidOptionReceivedError } from '@sequelize/core/_non-semver-use-at-your-own-risk_/utils/check.js';
import { expectsql, getTestDialect, sequelize } from '../../support';

const dialectName = getTestDialect();

describe('QueryGenerator#addColumnQuery', () => {
  const queryGenerator = sequelize.getQueryInterface().queryGenerator;

  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
  }, { timestamps: false });

  it('generates a ADD COLUMN query in supported dialects', () => {
    const sql = queryGenerator.addColumnQuery(User.tableName, 'age', {
      type: DataTypes.INTEGER,
    });

    expectsql(() => sql, {
      default: `ALTER TABLE [Users] ADD [age] INTEGER;`,
      mssql: `ALTER TABLE [Users] ADD [age] INTEGER NULL;`,
      postgres: `ALTER TABLE "public"."Users" ADD COLUMN "age" INTEGER;`,
      mysql: 'ALTER TABLE `Users` ADD `age` INTEGER;',
    });
  });

  it('generates a ADD COLUMN IF NOT EXISTS query in supported dialects', () => {
    expectsql(() => queryGenerator.addColumnQuery(User.tableName, 'age', {
      type: DataTypes.INTEGER,
    }, { ifNotExists: true }), {
      default: buildInvalidOptionReceivedError('addColumnQuery', dialectName, ['ifNotExists']),
      postgres: `ALTER TABLE "public"."Users" ADD COLUMN IF NOT EXISTS "age" INTEGER;`,
    });
  });
});
