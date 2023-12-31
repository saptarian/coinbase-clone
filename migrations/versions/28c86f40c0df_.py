"""empty message

Revision ID: 28c86f40c0df
Revises: 7aa208a22b69
Create Date: 2023-09-30 22:38:46.082004

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '28c86f40c0df'
down_revision = '7aa208a22b69'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('address',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('street', sa.String(length=50), nullable=True),
    sa.Column('unit', sa.String(length=50), nullable=True),
    sa.Column('city', sa.String(length=20), nullable=True),
    sa.Column('postal_code', sa.Integer(), nullable=True),
    sa.Column('country', sa.String(length=10), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('analytic',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('employment_status', sa.String(length=10), nullable=True),
    sa.Column('source_of_funds', sa.String(length=10), nullable=True),
    sa.Column('use_app_for', sa.String(length=10), nullable=True),
    sa.Column('work_in_industry', sa.String(length=20), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('identity',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('date_of_birth', sa.DateTime(), nullable=True),
    sa.Column('phone_number', sa.String(length=20), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('preference',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('timezone', sa.String(length=20), nullable=True),
    sa.Column('currency', sa.String(length=10), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('inactive', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(length=255),
               type_=sa.String(length=150),
               existing_nullable=False)
        batch_op.alter_column('password_hash',
               existing_type=sa.VARCHAR(length=100),
               nullable=False)
        batch_op.alter_column('admin',
               existing_type=sa.BOOLEAN(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('admin',
               existing_type=sa.BOOLEAN(),
               nullable=False)
        batch_op.alter_column('password_hash',
               existing_type=sa.VARCHAR(length=100),
               nullable=True)
        batch_op.alter_column('email',
               existing_type=sa.String(length=150),
               type_=sa.VARCHAR(length=255),
               existing_nullable=False)
        batch_op.drop_column('updated_at')
        batch_op.drop_column('inactive')

    op.drop_table('preference')
    op.drop_table('identity')
    op.drop_table('analytic')
    op.drop_table('address')
    # ### end Alembic commands ###
