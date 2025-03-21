export const betABI = [
  [
    {
      type: 'constructor',
      name: '',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: '_usdc',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: '_pointsToken',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
      outputs: null,
    },
    {
      type: 'function',
      name: 'PAYOUT_FEE_BP',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'claimPayouts',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'betIds',
          type: 'uint256[]',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'slice', nested_type: { type: 'uint' } },
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'transferOwnership',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'newOwner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'withdraw',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'amount',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'tokenType',
          type: 'uint8',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'nextBetId',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'nextPoolId',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'placeBet',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'poolId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'optionIndex',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'amount',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'bettor',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'tokenType',
          type: 'uint8',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: 'betId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'usdc',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
    },
    {
      type: 'function',
      name: 'userBets',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [
        {
          name: 'bettor',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: 'betIds',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'createPool',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'params',
          type: 'tuple',
          storage_location: 'default',
          components: [
            {
              name: 'question',
              type: 'string',
              storage_location: 'default',
              offset: 0,
              index:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              indexed: false,
              simple_type: { type: 'string' },
            },
            {
              name: 'options',
              type: 'string[2]',
              storage_location: 'memory',
              offset: 0,
              index:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              indexed: false,
              simple_type: { type: 'array', nested_type: { type: 'string' } },
            },
            {
              name: 'betsCloseAt',
              type: 'uint40',
              storage_location: 'default',
              offset: 0,
              index:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              indexed: false,
              simple_type: { type: 'uint' },
            },
            {
              name: 'closureCriteria',
              type: 'string',
              storage_location: 'default',
              offset: 0,
              index:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              indexed: false,
              simple_type: { type: 'string' },
            },
            {
              name: 'closureInstructions',
              type: 'string',
              storage_location: 'default',
              offset: 0,
              index:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              indexed: false,
              simple_type: { type: 'string' },
            },
          ],
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
        },
      ],
      outputs: [
        {
          name: 'poolId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'gradeBet',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'poolId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'responseOption',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'owner',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
    },
    {
      type: 'function',
      name: 'pointsToken',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
    },
    {
      type: 'function',
      name: 'pools',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [
        {
          name: 'poolId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: 'id',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'question',
          type: 'string',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'string' },
        },
        {
          name: 'betsCloseAt',
          type: 'uint40',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'winningOption',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'status',
          type: 'uint8',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'isDraw',
          type: 'bool',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'bool' },
        },
        {
          name: 'createdAt',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'closureCriteria',
          type: 'string',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'string' },
        },
        {
          name: 'closureInstructions',
          type: 'string',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'string' },
        },
      ],
    },
    {
      type: 'function',
      name: 'bets',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [
        {
          name: 'betId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: 'id',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'owner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'option',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'amount',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'poolId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'createdAt',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'updatedAt',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'isPayedOut',
          type: 'bool',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'bool' },
        },
        {
          name: 'tokenType',
          type: 'uint8',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'renounceOwnership',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: 'userBalances',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [
        {
          name: 'user',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: '',
          type: 'uint8',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'event',
      name: 'PayoutClaimed',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'betId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'uint' },
        },
        {
          name: 'poolId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'uint' },
        },
        {
          name: 'user',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'amount',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'tokenType',
          type: 'uint8',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: null,
    },
    {
      type: 'event',
      name: 'PoolClosed',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'poolId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'uint' },
        },
        {
          name: 'selectedOption',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: null,
    },
    {
      type: 'event',
      name: 'PoolCreated',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'poolId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'params',
          type: 'tuple',
          storage_location: 'default',
          components: [
            {
              name: 'question',
              type: 'string',
              storage_location: 'default',
              offset: 0,
              index:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              indexed: false,
              simple_type: { type: 'string' },
            },
            {
              name: 'options',
              type: 'string[2]',
              storage_location: 'memory',
              offset: 0,
              index:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              indexed: false,
              simple_type: { type: 'array', nested_type: { type: 'string' } },
            },
            {
              name: 'betsCloseAt',
              type: 'uint40',
              storage_location: 'default',
              offset: 0,
              index:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              indexed: false,
              simple_type: { type: 'uint' },
            },
            {
              name: 'closureCriteria',
              type: 'string',
              storage_location: 'default',
              offset: 0,
              index:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              indexed: false,
              simple_type: { type: 'string' },
            },
            {
              name: 'closureInstructions',
              type: 'string',
              storage_location: 'default',
              offset: 0,
              index:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
              indexed: false,
              simple_type: { type: 'string' },
            },
          ],
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
        },
      ],
      outputs: null,
    },
    {
      type: 'event',
      name: 'Withdrawal',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'user',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'amount',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'tokenType',
          type: 'uint8',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: null,
    },
    {
      type: 'event',
      name: 'BetPlaced',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'betId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'uint' },
        },
        {
          name: 'poolId',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'uint' },
        },
        {
          name: 'user',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'optionIndex',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'amount',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
        {
          name: 'tokenType',
          type: 'uint8',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: null,
    },
    {
      type: 'event',
      name: 'OwnershipTransferred',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'previousOwner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'newOwner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
      ],
      outputs: null,
    },
  ],
  [
    {
      type: 'constructor',
      name: '',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: null,
      outputs: null,
    },
    {
      type: 'function',
      name: 'transferFrom',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'from',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'to',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'bool',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'bool' },
        },
      ],
    },
    {
      type: 'function',
      name: 'allowance',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [
        {
          name: 'owner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'spender',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'approve',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'spender',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'bool',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'bool' },
        },
      ],
    },
    {
      type: 'function',
      name: 'balanceOf',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [
        {
          name: 'account',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'totalSupply',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'transfer',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'to',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'bool',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'bool' },
        },
      ],
    },
    {
      type: 'event',
      name: 'Approval',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'owner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'spender',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: null,
    },
    {
      type: 'event',
      name: 'Transfer',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'from',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'to',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: null,
    },
  ],
  [
    {
      type: 'constructor',
      name: '',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: null,
      outputs: null,
    },
    {
      type: 'function',
      name: 'transferFrom',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'from',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'to',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'bool',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'bool' },
        },
      ],
    },
    {
      type: 'function',
      name: 'approve',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'spender',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'bool',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'bool' },
        },
      ],
    },
    {
      type: 'function',
      name: 'decimals',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint8',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'symbol',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'string',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'string' },
        },
      ],
    },
    {
      type: 'function',
      name: 'totalSupply',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'allowance',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [
        {
          name: 'owner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'spender',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'balanceOf',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [
        {
          name: 'account',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'name',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'string',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'string' },
        },
      ],
    },
    {
      type: 'function',
      name: 'transfer',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'to',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'bool',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'bool' },
        },
      ],
    },
    {
      type: 'event',
      name: 'Approval',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'owner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'spender',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: null,
    },
    {
      type: 'event',
      name: 'Transfer',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'from',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'to',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: null,
    },
  ],
  [
    {
      type: 'constructor',
      name: '',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: null,
      outputs: null,
    },
  ],
  [
    {
      type: 'constructor',
      name: '',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: null,
      outputs: null,
    },
    {
      type: 'function',
      name: 'owner',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
    },
    {
      type: 'function',
      name: 'renounceOwnership',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: 'transferOwnership',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'newOwner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
      outputs: [],
    },
    {
      type: 'event',
      name: 'OwnershipTransferred',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'previousOwner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'newOwner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
      ],
      outputs: null,
    },
  ],
  [
    {
      type: 'constructor',
      name: '',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: null,
      outputs: null,
    },
  ],
  [
    {
      type: 'constructor',
      name: '',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: null,
      outputs: null,
    },
  ],
  [
    {
      type: 'constructor',
      name: '',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: null,
      outputs: null,
    },
  ],
  [
    {
      type: 'constructor',
      name: '',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: null,
      outputs: null,
    },
    {
      type: 'function',
      name: 'totalSupply',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'transfer',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'to',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'bool',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'bool' },
        },
      ],
    },
    {
      type: 'function',
      name: 'transferFrom',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'from',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'to',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'bool',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'bool' },
        },
      ],
    },
    {
      type: 'function',
      name: 'allowance',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [
        {
          name: 'owner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'spender',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'approve',
      constant: false,
      anonymous: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'spender',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'bool',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'bool' },
        },
      ],
    },
    {
      type: 'function',
      name: 'name',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'string',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'string' },
        },
      ],
    },
    {
      type: 'function',
      name: 'balanceOf',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [
        {
          name: 'account',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'address' },
        },
      ],
      outputs: [
        {
          name: '',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'decimals',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint8',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
    },
    {
      type: 'function',
      name: 'symbol',
      constant: false,
      anonymous: false,
      stateMutability: 'view',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'string',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'string' },
        },
      ],
    },
    {
      type: 'event',
      name: 'Approval',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'owner',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'spender',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: null,
    },
    {
      type: 'event',
      name: 'Transfer',
      constant: false,
      anonymous: false,
      stateMutability: '',
      inputs: [
        {
          name: 'from',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'to',
          type: 'address',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: true,
          simple_type: { type: 'address' },
        },
        {
          name: 'value',
          type: 'uint256',
          storage_location: 'default',
          offset: 0,
          index:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          indexed: false,
          simple_type: { type: 'uint' },
        },
      ],
      outputs: null,
    },
  ],
];