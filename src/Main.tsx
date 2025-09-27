import { Navigator } from '~/nav';
import { CategoryProvider } from './contexts/CategoryProvider';
import { HistoryProvider } from './contexts/HistoryProvider';

export default function Main() {
  return (
      <CategoryProvider>
        <HistoryProvider>
          <Navigator/>
        </HistoryProvider>
      </CategoryProvider>
  );
}
