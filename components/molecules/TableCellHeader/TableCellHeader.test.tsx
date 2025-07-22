import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableCellHeader, TableHeaderRow } from './TableCellHeader';

describe('TableCellHeader Component', () => {
  it('renders with text content', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableCellHeader>Product Name</TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByText('PRODUCT NAME')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader>Default</TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const header = container.querySelector('th');
    expect(header).toHaveClass('bg-neutral-100', 'text-neutral-900');
  });

  it('applies dark variant', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader variant="dark">Dark</TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const header = container.querySelector('th');
    expect(header).toHaveClass('bg-neutral-900', 'text-white');
  });

  it('applies transparent variant', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader variant="transparent">Transparent</TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const header = container.querySelector('th');
    expect(header).toHaveClass('bg-transparent', 'text-neutral-700');
  });

  it('applies alignment classes', () => {
    const { container: leftContainer } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader align="left">Left</TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    expect(leftContainer.querySelector('th')).toHaveClass('text-left');

    const { container: centerContainer } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader align="center">Center</TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    expect(centerContainer.querySelector('th')).toHaveClass('text-center', 'justify-center');

    const { container: rightContainer } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader align="right">Right</TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    expect(rightContainer.querySelector('th')).toHaveClass('text-right', 'flex-row-reverse');
  });

  it('renders with icon', () => {
    const TestIcon = () => <span data-testid="test-icon">📦</span>;
    render(
      <table>
        <thead>
          <tr>
            <TableCellHeader icon={<TestIcon />}>With Icon</TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('shows sort icon when sortable', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader sortable onSort={() => {}}>
              Sortable
            </TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const sortIcon = container.querySelector('svg');
    expect(sortIcon).toBeInTheDocument();
  });

  it('hides sort icon when showSortIcon is false', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader sortable showSortIcon={false} onSort={() => {}}>
              No Icon
            </TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const sortIcon = container.querySelector('svg');
    expect(sortIcon).not.toBeInTheDocument();
  });

  it('handles click events on sortable headers', () => {
    const handleSort = jest.fn();
    render(
      <table>
        <thead>
          <tr>
            <TableCellHeader sortable onSort={handleSort}>
              Click Me
            </TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    
    fireEvent.click(screen.getByText('CLICK ME'));
    expect(handleSort).toHaveBeenCalledTimes(1);
  });

  it('does not call onSort when not sortable', () => {
    const handleSort = jest.fn();
    render(
      <table>
        <thead>
          <tr>
            <TableCellHeader onSort={handleSort}>
              Not Sortable
            </TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    
    fireEvent.click(screen.getByText('NOT SORTABLE'));
    expect(handleSort).not.toHaveBeenCalled();
  });

  it('handles keyboard events on sortable headers', () => {
    const handleSort = jest.fn();
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader sortable onSort={handleSort}>
              Keyboard
            </TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    
    const header = container.querySelector('th');
    fireEvent.keyDown(header!, { key: 'Enter' });
    expect(handleSort).toHaveBeenCalledTimes(1);
    
    fireEvent.keyDown(header!, { key: ' ' });
    expect(handleSort).toHaveBeenCalledTimes(2);
  });

  it('displays correct sort direction', () => {
    const { container: ascContainer } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader sortable sortDirection="asc" onSort={() => {}}>
              Ascending
            </TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const ascHeader = ascContainer.querySelector('th');
    expect(ascHeader).toHaveAttribute('aria-sort', 'ascending');

    const { container: descContainer } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader sortable sortDirection="desc" onSort={() => {}}>
              Descending
            </TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const descHeader = descContainer.querySelector('th');
    expect(descHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('applies sticky positioning', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader sticky>Sticky</TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const header = container.querySelector('th');
    expect(header).toHaveClass('sticky', 'top-0', 'z-10');
  });

  it('applies custom width and minWidth', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader width="200px" minWidth="150px">
              Custom Width
            </TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const header = container.querySelector('th');
    expect(header).toHaveStyle({ width: '200px', minWidth: '150px' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader className="custom-class">Custom</TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const header = container.querySelector('th');
    expect(header).toHaveClass('custom-class');
  });

  it('has correct role and tabIndex when sortable', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader sortable onSort={() => {}}>
              Interactive
            </TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const header = container.querySelector('th');
    expect(header).toHaveAttribute('role', 'button');
    expect(header).toHaveAttribute('tabIndex', '0');
  });

  it('does not have role when not sortable', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableCellHeader>Static</TableCellHeader>
          </tr>
        </thead>
      </table>
    );
    const header = container.querySelector('th');
    expect(header).not.toHaveAttribute('role');
    expect(header).not.toHaveAttribute('tabIndex');
  });
});

describe('TableHeaderRow Component', () => {
  it('renders children', () => {
    render(
      <table>
        <thead>
          <TableHeaderRow>
            <TableCellHeader>Column 1</TableCellHeader>
            <TableCellHeader>Column 2</TableCellHeader>
          </TableHeaderRow>
        </thead>
      </table>
    );
    expect(screen.getByText('COLUMN 1')).toBeInTheDocument();
    expect(screen.getByText('COLUMN 2')).toBeInTheDocument();
  });

  it('applies border styles based on variant', () => {
    const { container: defaultContainer } = render(
      <table>
        <thead>
          <TableHeaderRow>
            <td>Default</td>
          </TableHeaderRow>
        </thead>
      </table>
    );
    expect(defaultContainer.querySelector('tr')).toHaveClass('border-neutral-200');

    const { container: darkContainer } = render(
      <table>
        <thead>
          <TableHeaderRow variant="dark">
            <td>Dark</td>
          </TableHeaderRow>
        </thead>
      </table>
    );
    expect(darkContainer.querySelector('tr')).toHaveClass('border-neutral-800');

    const { container: transparentContainer } = render(
      <table>
        <thead>
          <TableHeaderRow variant="transparent">
            <td>Transparent</td>
          </TableHeaderRow>
        </thead>
      </table>
    );
    expect(transparentContainer.querySelector('tr')).toHaveClass('border-neutral-200');
  });

  it('applies custom className', () => {
    const { container } = render(
      <table>
        <thead>
          <TableHeaderRow className="custom-row">
            <td>Custom</td>
          </TableHeaderRow>
        </thead>
      </table>
    );
    expect(container.querySelector('tr')).toHaveClass('custom-row');
  });
});