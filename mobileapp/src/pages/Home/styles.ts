import { StyleSheet } from 'react-native';
import { colors } from '../../global/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  welcome: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    backgroundColor: colors.PRIMARY,
    height: 55,
    elevation: 5,
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    backgroundColor: '#dedede',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  pickerContainer: {
    position: 'relative',
  },
  pickerLabel: {
    position: 'absolute',
    top: -10,
    left: 20,
    zIndex: 999,
    color: colors.PRIMARY,
  },
  toggle: {
    color: '#FFF',
  },
  valuesContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    height: '100%',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tempContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    padding: 10,
  },
  tempLabel: {
    fontSize: 14,
    color: colors.PRIMARY,
    position: 'absolute',
    top: 0,
    left: 20,
  },
  analogLabel: {
    fontSize: 14,
    color: colors.PRIMARY,
    position: 'absolute',
    top: 0,
    left: 20,
  },
  analogContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    padding: 10,
  },
  value: {
    fontSize: 48,
    color: colors.PRIMARY,
    fontWeight: 'bold',
  },
});
